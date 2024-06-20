function rewrite(element, proxyUrl) {
    const attributes = ['href', 'src'];
    const cssImportRegex = /(?<=url\(["']?)[^"']+(?=["']?\))/g;
    const jsImportRegex = /(?<=import\s*['"])[^'"]+(?=['"])/g;

    attributes.forEach(attr => {
        const attrValue = element.getAttribute(attr);
        if (attrValue && !attrValue.includes('native.js')) {
            const url = new URL(attrValue, proxyUrl);
            element.setAttribute(attr, `${location.origin}/url/${url}`);
        }
    });

    element.removeAttribute('integrity');

    if (element.hasAttribute('style')) {
        const newStyleValue = element.getAttribute('style').replace(cssImportRegex, match => {
            const url = new URL(match, proxyUrl);
            return `${location.origin}/url/${url}`;
        });
        element.setAttribute('style', newStyleValue);
    }

    if (element.tagName === 'SCRIPT' && element.type?.toLowerCase() === 'module') {
        fetch(new URL(element.src, proxyUrl))
            .then(res => res.text())
            .then(script => {
                const newScript = script.replace(jsImportRegex, match => {
                    const url = new URL(match, proxyUrl);
                    return `${location.origin}/url/${url}`;
                });
                element.src = URL.createObjectURL(new Blob([newScript], { type: 'application/javascript' }));
            });
    }
}

function rewriteCssImport(styleContent, proxyUrl) {
    return styleContent.replace(/(?<=url\(["']?)[^"']+(?=["']?\))/g, match => {
        const url = new URL(match, proxyUrl);
        return `${location.origin}/url/${url}`;
    });
}

const proxyUrl = location.pathname.split('/url/').pop();

document.querySelectorAll('[href], [src], [style], script[type="module"]').forEach(el => rewrite(el, proxyUrl));

document.querySelectorAll('link[rel="stylesheet"]').forEach(linkEl => {
    fetch(linkEl.href)
        .then(res => res.text())
        .then(css => {
            const newStyleElement = document.createElement('style');
            newStyleElement.innerHTML = rewriteCssImport(css, proxyUrl);
            linkEl.replaceWith(newStyleElement);
        });
});

new MutationObserver(mutations => {
    mutations.forEach(({ type, addedNodes }) => {
        if (type === 'childList') {
            addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    node.querySelectorAll('[href], [src], [style], script[type="module"]').forEach(el => rewrite(el, proxyUrl));
                }
            });
        }
    });
}).observe(document.body, { childList: true, subtree: true });
