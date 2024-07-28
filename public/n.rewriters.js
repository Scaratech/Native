import { isNative, encodeUrl, decodeUrl } from "./n.utils.js";

function rewriteSrcset(srcset) {
    const urls = srcset.split(/ [0-9]+x,? ?/g);
    const suffixes = srcset.match(/ [0-9]+x,? ?/g);

    if (!urls || !suffixes) {
        return "";
    }
    const rewrittenUrls = urls.map((url, i) => {
        if (url && suffixes[i]) {
            return encodeUrl(url) + suffixes[i];
        }
    });

    return rewrittenUrls.join("");
}


export function rewriteHtml(element) {
    const attributes = ['href', 'src', 'srcset'];
    const proxyUrl = decodeUrl(location.href);

    attributes.forEach(attr => {
        const attrValue = element.getAttribute(attr);
        if (attrValue && isNative(element) === false) {
            if (attr === 'srcset') {
                element.setAttribute(attr, rewriteSrcset(attrValue));
            } else {
                const url = new URL(attrValue, proxyUrl);
                element.setAttribute(attr, `${encodeUrl(url)}`);
            }
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