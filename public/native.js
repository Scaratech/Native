function rewrite(element) {
    const href = element.getAttribute('href');
    const src = element.getAttribute('src');

    if (src && src.includes('native.js')) {
        return; // lmao
    }
    
    if (href) {
        if (!href.startsWith('http')) {
            element.setAttribute('href', `${window.location.href}${encodeURIComponent(href)}`);
        } else {
            element.setAttribute('href', `${window.location.origin}/url/${encodeURIComponent(href)}`);
        }
    }
    
    if (src) {
        if (!src.startsWith('http')) {
            element.setAttribute('src', `${window.location.href}${encodeURIComponent(src)}`);
        } else {
            element.setAttribute('src', `${window.location.origin}/url/${encodeURIComponent(src)}`);
        }
    }

    if (element.hasAttribute('integrity')) {
        element.removeAttribute('integrity'); // wtf is this
    }
}

const elements = document.querySelectorAll('[href], [src]');
elements.forEach(rewrite);

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                rewrite(node);
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });