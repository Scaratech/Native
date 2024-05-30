function rewrite(element, proxyUrl) {
    const attributes = ['href', 'src']; // Rewrite these attr's

    attributes.forEach(attr => {
        const attrValue = element.getAttribute(attr);

        if (attrValue && !attrValue.includes('native.js')) { // Don't rewrite the rewritier
            const url = new URL(attrValue, proxyUrl);
            element.setAttribute(attr, `${window.location.origin}/url/${url}`);
        }
    });

    if (element.hasAttribute('integrity')) {
        element.removeAttribute('integrity'); // kys
    }
}

function getUrl() {
    return window.location.pathname.split('/url/').pop(); // Grab URL
};

const proxyUrl = getUrl();

const elements = document.querySelectorAll('[href], [src]');
elements.forEach(element => rewrite(element, proxyUrl));