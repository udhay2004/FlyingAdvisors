// Self-hosted fonts (latin subsets only, font-display: swap is the Fontsource default).
import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/latin-300-italic.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/hanken-grotesk/latin-400.css';
import '@fontsource/hanken-grotesk/latin-500.css';
import '@fontsource/pinyon-script/latin-400.css';
import 'lenis/dist/lenis.css';
import './main.css';

declare global {
  interface Window {
    __siteReady?: boolean;
  }
}
// Tells the inline fallback in index.html that JavaScript is running.
window.__siteReady = true;

// Paint first, then load the animation code (GSAP, Lenis, forms). Running
// ~150 KB of script before the first paint was the main cause of slow
// mobile loading. The hero photo and layout paint while it loads.
requestAnimationFrame(() => setTimeout(() => import('./app'), 0));
