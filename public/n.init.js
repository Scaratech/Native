import { rewriteHtml, rewriteCss, rewriteSrcset } from "./n.rewriters.js";

document.querySelectorAll('[href], [src]').forEach(element => {
    rewriteHtml(element);
});

document.querySelectorAll('style').forEach(styleElement => {
    const rewrittenCss = rewriteCss(styleElement.innerHTML);
    styleElement.innerHTML = rewrittenCss;
});

document.querySelectorAll('[srcset]').forEach(element => {
    const srcsetContent = element.getAttribute('srcset');
    const rewrittenSrcset = rewriteSrcset(srcsetContent);
    element.setAttribute('srcset', rewrittenSrcset);
});