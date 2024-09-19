# Native
Webporxy\
**THIS WAS MADE FOR FUN IT DOES NOT ACTUALLY WORK WITH 99% OF SITES**


## Deployment
```sh
$ git clone https://github.com/entrpix/native
$ cd native
$ npm i 
$ npm start
```

## V2 Roadmap
- [ ] COMPLETLEY client-side. No weird server and can run even without a static-site hoster
- [ ] `Libcurl.js` for fetching
- [ ] Rewrite attributes using `document` API (Replace `/example/` with `URL/example/`)
- [ ] Display proxied page in a `srcdoc` iframe
- [ ] Use `ContextualFragments` to use `document` APIs
- [ ] For page navigation add a click `eventListener` to `<a>` tags to rewrite the response and update the `srcdoc`
- [ ] Rewrite CSS by fetching it and replacing it from `<link rel="stylesheet" href="/styles.css">` to `<style>Rewritten CSS</style>`
- [ ] TODO: How the hell am I gonna do JS rewriting
- [ ] TODO: Figure out `codecs`
- [ ] I could probably just inject patched client APIs into the `srcdoc`
- [ ] Add `esbuild`
- [ ] Make blog post 🤑

### Limiations:
- [ ] Cannot use `blobs` (I *think*)
- [ ] How the fuck am I suppose to do JS rewriting
- [ ] I don't know why I'm using `srcdoc` I can *probably* just append it to the `DOM` but fuck you
- [ ] No scope (`/uv/`, `/url/`, etc.)
- [ ] Some `CSP` attributes cannot be removed (Ex. `nonce`)
