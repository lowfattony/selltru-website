const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFile } = require('child_process');

const ENDPOINT_HOST = 'api.indexnow.org';
const ENDPOINT_PATH = '/indexnow';

function git(args, cwd) {
  return new Promise((resolve, reject) => {
    execFile(
      'git',
      args,
      { cwd, timeout: 30000, maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' },
      (err, stdout, stderr) => {
        if (err) {
          err.stderr = stderr;
          reject(err);
          return;
        }
        resolve(stdout);
      }
    );
  });
}

function htmlPathsFromNameStatus(text) {
  const parts = String(text).split('\0').filter((part) => part !== '');
  const paths = [];
  let i = 0;
  while (i < parts.length) {
    const status = parts[i++] || '';
    const code = status.charAt(0);
    const pair = code === 'R' || code === 'C';
    const first = parts[i++] || '';
    const second = pair ? (parts[i++] || '') : '';
    if (!'ACDMRT'.includes(code)) continue;
    const candidates = pair ? [first, second] : [first];
    for (const candidate of candidates) {
      if (candidate.toLowerCase().endsWith('.html')) paths.push(candidate);
    }
  }
  return paths;
}

function parseHtmlRedirects(text) {
  const map = new Map();
  for (const line of String(text).split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const cols = trimmed.split(/\s+/);
    if (cols.length < 2) continue;
    const from = cols[0];
    const to = cols[1];
    if (from.includes('*') || !from.endsWith('.html') || !to.startsWith('/')) continue;
    if (!map.has(from)) map.set(from, to);
  }
  return map;
}

function htmlPathToUrl(relPath, host, redirectMap) {
  const norm = String(relPath).replace(/\\/g, '/').replace(/^\.\//, '');
  if (!norm.toLowerCase().endsWith('.html')) return null;
  const requestPath = '/' + norm;
  let dest = redirectMap && redirectMap.get(requestPath);
  if (!dest) {
    dest = norm.toLowerCase() === 'index.html' ? '/' : '/' + norm.slice(0, -'.html'.length);
  }
  if (!dest.startsWith('/')) return null;
  if (dest.length > 1 && dest.endsWith('/')) dest = dest.slice(0, -1);
  if (dest === '/') return 'https://' + host + '/';
  return 'https://' + host + dest;
}

function readKey(filePath, expected) {
  const text = fs.readFileSync(filePath, 'utf8');
  if (text !== expected && text !== expected + '\n' && text !== expected + '\r\n') {
    return null;
  }
  return expected;
}

function postIndexNow(payload) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8');
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: ENDPOINT_HOST,
        path: ENDPOINT_PATH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': body.length,
        },
        timeout: 20000,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('error', reject);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            body: Buffer.concat(chunks).toString('utf8').slice(0, 500),
          });
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('IndexNow request timed out'));
    });
    req.write(body);
    req.end();
  });
}

async function parentCommit(cwd) {
  try {
    return (await git(['rev-parse', '--verify', 'HEAD^'], cwd)).trim();
  } catch (err) {
    return null;
  }
}

async function ensureParent(cwd, log) {
  const existing = await parentCommit(cwd);
  if (existing) return existing;
  try {
    log('[indexnow] parent commit missing; deepening the clone by 1');
    await git(['fetch', '--deepen=1'], cwd);
  } catch (err) {
    log('[indexnow] could not deepen the clone (' + (err.message || err) + ')');
    return null;
  }
  return parentCommit(cwd);
}

async function submitChangedUrls(options) {
  const log = options.log || console.log;
  try {
    const context = options.context || '';
    if (context !== 'production') {
      log('[indexnow] skipped: context is "' + (context || 'unset') + '" (production only; deploy previews and branch deploys are skipped)');
      return { ok: true, skipped: true, reason: 'context:' + (context || 'unset') };
    }

    const host = options.host || 'selltru.com';
    if (!/^[A-Za-z0-9.-]+$/.test(host) || host.includes('..')) {
      log('[indexnow] skipped: invalid host');
      return { ok: false, skipped: true, reason: 'invalid-host' };
    }

    const keyFile = options.keyFile || '';
    if (!/^[a-f0-9]{32}\.txt$/.test(keyFile) || keyFile !== path.basename(keyFile)) {
      log('[indexnow] skipped: keyFile must be a 32-char hex name ending in .txt');
      return { ok: false, skipped: true, reason: 'invalid-key-file-name' };
    }
    const expectedKey = keyFile.slice(0, -4);
    const publishDir = options.publishDir || options.cwd || process.cwd();
    const keyPath = path.join(publishDir, keyFile);
    if (!fs.existsSync(keyPath)) {
      log('[indexnow] skipped: key file not in the publish directory (' + keyFile + ')');
      return { ok: false, skipped: true, reason: 'missing-key-file' };
    }
    const key = readKey(keyPath, expectedKey);
    if (!key) {
      log('[indexnow] skipped: key file must contain only the key');
      return { ok: false, skipped: true, reason: 'bad-key-file' };
    }

    const cwd = options.cwd || process.cwd();
    let gitRoot = cwd;
    try {
      gitRoot = (await git(['rev-parse', '--show-toplevel'], cwd)).trim();
    } catch (err) {
      log('[indexnow] skipped: not a git checkout (' + (err.message || err) + ')');
      return { ok: false, skipped: true, reason: 'no-git' };
    }

    const parent = await ensureParent(gitRoot, log);
    if (!parent) {
      log('[indexnow] skipped: no previous commit to diff');
      return { ok: true, skipped: true, reason: 'no-parent-commit' };
    }

    const diff = await git(['diff', '--name-status', '--find-renames', '-z', parent, 'HEAD'], gitRoot);
    const htmlPaths = htmlPathsFromNameStatus(diff);
    let redirectMap = new Map();
    const redirectsPath = path.join(gitRoot, '_redirects');
    if (fs.existsSync(redirectsPath)) {
      redirectMap = parseHtmlRedirects(fs.readFileSync(redirectsPath, 'utf8'));
    }
    const urls = [];
    const seen = new Set();
    for (const rel of htmlPaths) {
      const url = htmlPathToUrl(rel, host, redirectMap);
      if (!url || seen.has(url)) continue;
      if (!url.startsWith('https://' + host + '/') && url !== 'https://' + host + '/') continue;
      seen.add(url);
      urls.push(url);
    }
    urls.sort();
    if (!urls.length) {
      log('[indexnow] skipped: no HTML files changed versus the previous commit');
      return { ok: true, skipped: true, reason: 'no-html-changes', parent: parent };
    }

    const urlList = urls.slice(0, 10000);
    if (urls.length > urlList.length) {
      log('[indexnow] trimming URL list from ' + urls.length + ' to 10000');
    }
    const payload = {
      host: host,
      key: key,
      keyLocation: 'https://' + host + '/' + keyFile,
      urlList: urlList,
    };
    log('[indexnow] submitting ' + urlList.length + ' URL(s) from ' + parent.slice(0, 12) + '..HEAD');
    for (const url of urlList) log('[indexnow] ' + url);

    const post = options.post || module.exports.postIndexNow;
    let response;
    try {
      response = await post(payload);
    } catch (err) {
      log('[indexnow] request failed (build continues): ' + (err.message || err));
      return { ok: false, error: err.message || String(err), count: urlList.length };
    }
    const status = response && response.status;
    if (status >= 200 && status < 300) {
      log('[indexnow] HTTP ' + status + ' accepted ' + urlList.length + ' URL(s)');
      return { ok: true, submitted: true, status: status, count: urlList.length, urls: urlList };
    }
    log('[indexnow] HTTP ' + status + ' (build continues): ' + ((response && response.body) || ''));
    return { ok: false, submitted: false, status: status, count: urlList.length };
  } catch (err) {
    log('[indexnow] failed without failing the build: ' + (err.stack || err));
    return { ok: false, error: err.message || String(err) };
  }
}

function optionsFromPlugin(api) {
  const constants = (api && api.constants) || {};
  const pluginInputs = (api && api.inputs) || {};
  return {
    context: process.env.CONTEXT,
    cwd: process.cwd(),
    publishDir: constants.PUBLISH_DIR || process.cwd(),
    host: pluginInputs.host || 'selltru.com',
    keyFile: pluginInputs.keyFile,
    log: console.log,
  };
}

async function onSuccess(api) {
  try {
    return await module.exports.submitChangedUrls(optionsFromPlugin(api));
  } catch (err) {
    console.log('[indexnow] failed without failing the build: ' + (err && err.stack ? err.stack : err));
    return { ok: false, error: (err && err.message) || String(err) };
  }
}

module.exports = {
  onSuccess,
  submitChangedUrls,
  postIndexNow,
  htmlPathsFromNameStatus,
  parseHtmlRedirects,
  htmlPathToUrl,
  readKey,
};
