import { rewriteHtml, rewriteCss } from "./n.rewriters.js";

document.querySelectorAll('[href], [src], [srcset]').forEach(element => {
    rewriteHtml(element);
});

document.querySelectorAll('style').forEach(styleElement => {
    const rewrittenCss = rewriteCss(styleElement.innerHTML);
    styleElement.innerHTML = rewrittenCss;
}); 