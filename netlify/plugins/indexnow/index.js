const lib = require('./lib');

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
    return await lib.submitChangedUrls(optionsFromPlugin(api));
  } catch (err) {
    console.log('[indexnow] failed without failing the build: ' + (err && err.stack ? err.stack : err));
    return { ok: false, error: (err && err.message) || String(err) };
  }
}

// Netlify rejects any export that is not a build event. Helpers live in lib.js.
module.exports = { onSuccess };
