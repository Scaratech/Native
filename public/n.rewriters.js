import { isNative, encodeUrl, decodeUrl } from "./n.utils.js";

export function rewriteHtml(element) {
    const attributes = ['href', 'src', 'src'];
    const proxyUrl = decodeUrl(location.href);

    attributes.forEach(attr => {
        const attrValue = element.getAttribute(attr);
        if (attrValue && isNative(element) === false) {
            const url = new URL(attrValue, proxyUrl);
            element.setAttribute(attr, `${encodeUrl(url)}`);
        }
    });

    element.removeAttribute('integrity');
}

export function rewriteCss(css) {
    return css.replace(
        /(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g,
        (match) => {
            const encodedUrl = encodeUrl(match);
            return `url("${encodedUrl}")`;
        }
    );
}

export function rewriteSrcset(srcset) {
    const urls = srcset.split(/ [0-9]+x,? ?/g);
    const sufixes = srcset.match(/ [0-9]+x,? ?/g);

    if (!urls || !sufixes) {
        return "";
    }
    const rewrittenUrls = urls.map((url, i) => {
        if (url && sufixes[i]) {
            return encodeUrl(url) + sufixes[i];
        }
    });

    return rewrittenUrls.join("");
}
