function rewrite(element) {
    const href = element.getAttribute('href');
    const src = element.getAttribute('src');
    
    if (href) {
        if (!href.startsWith('http')) {
            element.setAttribute('href', `${window.location.href}${href}`);
        } else {
            element.setAttribute('href', `${window.location.origin}/url/${href}`); // Fix URLs
        }
    }
    
    if (src) {
        if (!src.startsWith('http')) {
            element.setAttribute('src', `${window.location.href}${src}`);
        } else {
            element.setAttribute('src', `${window.location.origin}/url/${src}`); // Fix URLs
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
}); // who up observering your mutations