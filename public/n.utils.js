export function encodeUrl(url) {
    const encoded = encodeURIComponent(btoa(url));
    return `${location.origin}/url/${encoded}`;
}

export function decodeUrl(url) {
    const template = url.slice(location.origin.length + 5);
    const decoded = atob(decodeURIComponent(template));
    return decoded;
}

export function isNative(src) {
    const files = ['n.client.js', 'n.rewriters.js', 'n.utils.js', 'n.init.js'];

    if (typeof src !== 'string') {
        return false;
    }

    return files.some(file => src.includes(file));
}