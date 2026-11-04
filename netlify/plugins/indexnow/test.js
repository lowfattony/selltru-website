const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const plugin = require('./index.js');
const lib = require('./lib.js');

function git(dir, args) {
  execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: 'pipe' });
}

function initRepo(dir) {
  fs.mkdirSync(dir, { recursive: true });
  git(dir, ['init', '-b', 'main']);
  git(dir, ['config', 'user.email', 'cursoragent@cursor.com']);
  git(dir, ['config', 'user.name', 'Cursor Agent']);
}

function write(dir, rel, body) {
  const full = path.join(dir, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, body);
}

function commit(dir, message) {
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-m', message]);
}

const key = '0123456789abcdef0123456789abcdef';
const keyFile = key + '.txt';

function testParser() {
  const text = 'M\0blog/a.html\0A\0index.html\0D\0old.html\0R100\0from.html\0to.html\0C050\0copy-src.html\0copy-dst.html\0T\0typed.html\0M\0readme.md\0';
  const paths = lib.htmlPathsFromNameStatus(text);
  assert.deepStrictEqual(paths, [
    'blog/a.html',
    'index.html',
    'old.html',
    'from.html',
    'to.html',
    'copy-src.html',
    'copy-dst.html',
    'typed.html',
  ]);
}

function testRedirects() {
  const redirects = fs.readFileSync(path.join(__dirname, '..', '..', '..', '_redirects'), 'utf8');
  const map = lib.parseHtmlRedirects(redirects);
  const host = 'selltru.com';
  assert.strictEqual(lib.htmlPathToUrl('index.html', host, map), 'https://selltru.com/');
  assert.strictEqual(lib.htmlPathToUrl('about.html', host, map), 'https://selltru.com/about');
  assert.strictEqual(
    lib.htmlPathToUrl('blog/walmart-connect-ads-guide.html', host, map),
    'https://selltru.com/blog/walmart-connect-ads-guide'
  );
  assert.strictEqual(
    lib.htmlPathToUrl('blog/walmart-fulfillment-services-wfs-guide.html', host, map),
    'https://selltru.com/blog/walmart-fulfillment-services-wfs-guide'
  );
  assert.strictEqual(lib.htmlPathToUrl('blog/_template.html', host, map), 'https://selltru.com/blog');
  assert.strictEqual(
    lib.htmlPathToUrl('amazon-dsp-agency.html', host, map),
    'https://selltru.com/amazon-dsp-management'
  );
  assert.strictEqual(
    lib.htmlPathToUrl('blog/best-amazon-ppc-agencies-2026.html', host, map),
    'https://selltru.com/blog/best-amazon-ppc-management-2026'
  );
  assert.strictEqual(lib.htmlPathToUrl('notes.txt', host, map), null);
}

async function testContextsSkip() {
  let calls = 0;
  const post = async () => { calls += 1; return { status: 200, body: '' }; };
  for (const context of ['deploy-preview', 'branch-deploy', 'dev', '', undefined]) {
    const result = await lib.submitChangedUrls({ context, post, keyFile, host: 'selltru.com' });
    assert.strictEqual(result.skipped, true, context);
    assert.ok(String(result.reason).startsWith('context:'), result.reason);
  }
  assert.strictEqual(calls, 0);
}

async function testOnSuccessSwallows() {
  const original = lib.submitChangedUrls;
  lib.submitChangedUrls = async () => { throw new Error('boom'); };
  const previous = process.env.CONTEXT;
  process.env.CONTEXT = 'production';
  try {
    const result = await plugin.onSuccess({ constants: { PUBLISH_DIR: os.tmpdir() }, inputs: { host: 'selltru.com', keyFile } });
    assert.strictEqual(result.ok, false);
    assert.ok(result.error.includes('boom'));
  } finally {
    lib.submitChangedUrls = original;
    if (previous === undefined) delete process.env.CONTEXT;
    else process.env.CONTEXT = previous;
  }
}

async function testDeployPreviewDoesNotPost() {
  let calls = 0;
  const original = lib.postIndexNow;
  lib.postIndexNow = async () => { calls += 1; return { status: 200, body: '' }; };
  const previous = process.env.CONTEXT;
  process.env.CONTEXT = 'deploy-preview';
  try {
    const result = await plugin.onSuccess({
      constants: { PUBLISH_DIR: os.tmpdir() },
      inputs: { host: 'selltru.com', keyFile },
    });
    assert.strictEqual(result.skipped, true);
    assert.strictEqual(calls, 0);
  } finally {
    lib.postIndexNow = original;
    if (previous === undefined) delete process.env.CONTEXT;
    else process.env.CONTEXT = previous;
  }
}

async function testProductionDiff() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
  initRepo(dir);
  write(dir, '_redirects', '/index.html    /    301!\n/blog/_template.html    /blog    301!\n');
  write(dir, 'index.html', '<html></html>\n');
  write(dir, 'about.html', '<html>a</html>\n');
  write(dir, 'blog/_template.html', '<html>t</html>\n');
  write(dir, keyFile, key);
  write(dir, 'notes.txt', 'ignore\n');
  commit(dir, 'base');
  write(dir, 'index.html', '<html>home</html>\n');
  write(dir, 'blog/_template.html', '<html>template</html>\n');
  write(dir, 'notes.txt', 'still ignore\n');
  commit(dir, 'change html');

  let payload = null;
  const result = await lib.submitChangedUrls({
    context: 'production',
    cwd: dir,
    publishDir: dir,
    host: 'selltru.com',
    keyFile,
    post: async (body) => {
      payload = body;
      return { status: 202, body: '' };
    },
  });
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.status, 202);
  assert.deepStrictEqual(payload.urlList, [
    'https://selltru.com/',
    'https://selltru.com/blog',
  ]);
  assert.strictEqual(payload.host, 'selltru.com');
  assert.strictEqual(payload.key, key);
  assert.strictEqual(payload.keyLocation, 'https://selltru.com/' + keyFile);
}

async function testHttpFailureDoesNotThrow() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-fail-'));
  initRepo(dir);
  write(dir, 'about.html', '<html>a</html>\n');
  write(dir, keyFile, key);
  commit(dir, 'base');
  write(dir, 'about.html', '<html>b</html>\n');
  commit(dir, 'edit');
  const rejected = await lib.submitChangedUrls({
    context: 'production',
    cwd: dir,
    publishDir: dir,
    host: 'selltru.com',
    keyFile,
    post: async () => ({ status: 403, body: 'key not valid' }),
  });
  assert.strictEqual(rejected.ok, false);
  assert.strictEqual(rejected.status, 403);
  const thrown = await lib.submitChangedUrls({
    context: 'production',
    cwd: dir,
    publishDir: dir,
    host: 'selltru.com',
    keyFile,
    post: async () => { throw new Error('socket hang up'); },
  });
  assert.strictEqual(thrown.ok, false);
  assert.ok(thrown.error.includes('socket hang up'));
}

async function testBadKeySkips() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-key-'));
  initRepo(dir);
  write(dir, 'about.html', '<html>a</html>\n');
  write(dir, keyFile, key + '\nextra');
  commit(dir, 'base');
  write(dir, 'about.html', '<html>b</html>\n');
  commit(dir, 'edit');
  let calls = 0;
  const result = await lib.submitChangedUrls({
    context: 'production',
    cwd: dir,
    publishDir: dir,
    host: 'selltru.com',
    keyFile,
    post: async () => { calls += 1; return { status: 200, body: '' }; },
  });
  assert.strictEqual(result.reason, 'bad-key-file');
  assert.strictEqual(calls, 0);
}

async function testShallowClone() {
  const origin = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-origin-'));
  initRepo(origin);
  write(origin, 'page.html', '<html>1</html>\n');
  write(origin, keyFile, key);
  commit(origin, 'base');
  write(origin, 'page.html', '<html>2</html>\n');
  commit(origin, 'update');
  const shallow = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-shallow-'));
  execFileSync('git', ['clone', '--depth', '1', '--no-local', origin, shallow], { encoding: 'utf8', stdio: 'pipe' });
  let payload = null;
  const result = await lib.submitChangedUrls({
    context: 'production',
    cwd: shallow,
    publishDir: shallow,
    host: 'selltru.com',
    keyFile,
    post: async (body) => {
      payload = body;
      return { status: 200, body: '' };
    },
  });
  assert.strictEqual(result.ok, true, JSON.stringify(result));
  assert.deepStrictEqual(payload.urlList, ['https://selltru.com/page']);
}

async function testPluginExportsOnlyOnSuccess() {
  assert.deepStrictEqual(Object.keys(plugin).sort(), ['onSuccess']);
  const { pathToFileURL } = require('url');
  const loaded = await import(pathToFileURL(require.resolve('./index.js')).href);
  const logic = loaded.default === undefined ? loaded : loaded.default;
  const events = new Set(['onPreBuild', 'onBuild', 'onPostBuild', 'onSuccess', 'onError', 'onEnd', 'onPreDev', 'onDev']);
  const keys = Object.keys(logic);
  assert.ok(keys.includes('onSuccess'), keys.join(','));
  for (const key of keys) {
    assert.ok(events.has(key), 'Netlify would reject export ' + key);
    assert.strictEqual(typeof logic[key], 'function');
  }
}

(async () => {
  await testPluginExportsOnlyOnSuccess();
  testParser();
  testRedirects();
  await testContextsSkip();
  await testOnSuccessSwallows();
  await testDeployPreviewDoesNotPost();
  await testProductionDiff();
  await testHttpFailureDoesNotThrow();
  await testBadKeySkips();
  await testShallowClone();
  console.log('indexnow plugin tests passed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
