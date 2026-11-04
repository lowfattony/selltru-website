# SellTru website

Static site for [selltru.com](https://selltru.com). Netlify publishes the repository root. There is no site build command.

## IndexNow

Production deploys tell IndexNow which HTML pages changed so participating engines (including Bing) can recrawl them.

The key file is `f4a2be597f17994fe6ae0b11b38244eb.txt` at the site root. It contains only the key, with no newline. IndexNow checks it at `https://selltru.com/f4a2be597f17994fe6ae0b11b38244eb.txt`.

`netlify/plugins/indexnow` is a local Netlify Build plugin. Its `onSuccess` hook runs after the deploy is live:

1. It returns immediately unless `CONTEXT` is `production`. Deploy previews (`deploy-preview`) and branch deploys (`branch-deploy`) do not submit URLs.
2. It diffs HTML files against the previous commit (`git diff HEAD^ HEAD`). `GIT_DEPTH` is `2` so that parent exists. If the clone is still too shallow, the plugin runs `git fetch --deepen=1` once.
3. It maps those files to clean URLs on `https://selltru.com`. `index.html` becomes `https://selltru.com/`. Any other `path/page.html` becomes `https://selltru.com/path/page`, unless an exact `.html` rule in `_redirects` points elsewhere (for example `blog/_template.html` goes to `/blog`).
4. It POSTs `host`, `key`, `keyLocation`, and `urlList` to `https://api.indexnow.org/indexnow`.

A missing parent commit, a bad key file, a network error, or a non-success response is logged and does not fail the build.

`indexnow-ping.py` is a separate manual script. It still uses the older key file `7a55c6142aade8cd452dc288947f23113be28cb25d42ae28e3f61aa4e2e220da.txt`.

To rotate the deploy key, add a new 32-character hex file at the root, put only the key in it, and set `keyFile` in `netlify.toml` to that filename.
