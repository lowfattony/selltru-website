#!/usr/bin/env python3
"""Ping IndexNow when pages change, so Bing (and therefore ChatGPT search) sees them in minutes.

Usage:
    python indexnow-ping.py https://selltru.com/blog/new-post [more-urls...]
    python indexnow-ping.py --sitemap        # submit every URL in sitemap.xml

The key file must be live at https://selltru.com/<KEY>.txt before this will work.
"""
import sys, json, re, os, urllib.request

KEY = "02373b41833240e6953a4ea558cf1314f0ae97e59c034484835318e41e5d261a"
HOST = "selltru.com"
BASE = os.path.dirname(os.path.abspath(__file__))
ENDPOINT = "https://api.indexnow.org/IndexNow"


def urls_from_sitemap():
    sm = open(os.path.join(BASE, "sitemap.xml"), encoding="utf-8").read()
    return re.findall(r"<loc>([^<]+)</loc>", sm)


def ping(urls):
    if not urls:
        print("nothing to submit")
        return 1
    if len(urls) > 10000:
        print("IndexNow caps a single submission at 10,000 URLs")
        return 1
    body = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": "https://%s/%s.txt" % (HOST, KEY),
        "urlList": urls,
    }).encode("utf-8")
    req = urllib.request.Request(ENDPOINT, data=body,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print("HTTP %s — submitted %d URL(s)" % (r.status, len(urls)))
            # 200 accepted, 202 accepted but key still validating
            return 0 if r.status in (200, 202) else 1
    except urllib.error.HTTPError as e:
        print("HTTP %s — %s" % (e.code, e.read().decode("utf-8", "replace")[:300]))
        print("403 usually means the key file is not live yet at the keyLocation above.")
        return 1


if __name__ == "__main__":
    args = sys.argv[1:]
    sys.exit(ping(urls_from_sitemap() if args[:1] == ["--sitemap"] else args))
