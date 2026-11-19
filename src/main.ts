// Self-hosted fonts (latin subsets only, font-display: swap is the Fontsource default).
import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/latin-300-italic.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/hanken-grotesk/latin-400.css';
import '@fontsource/hanken-grotesk/latin-500.css';
import '@fontsource/pinyon-script/latin-400.css';
import 'lenis/dist/lenis.css';
import './main.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

import { LENIS_LERP, SLOW_SCROLL } from './config';
import { initContactForm, initFaq, initQuoteForm } from './forms';

declare global {
  interface Window {
    __siteReady?: boolean;
  }
}
window.__siteReady = true;

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });
// Dev only: inspect triggers from the browser console.
if (import.meta.env.DEV) Object.assign(window, { ScrollTrigger, gsap });

// ---------------------------------------------------------------------------
// Elements
// ---------------------------------------------------------------------------

function must<T extends Element>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

const root = document.documentElement;
const hero = must<HTMLElement>('[data-hero]');
const heroImgBox = must<HTMLElement>('[data-hero-img]');
const heroImg = must<HTMLImageElement>('img', heroImgBox);
const heroShade = must<HTMLElement>('[data-hero-shade]');
const heroHeadline = must<HTMLElement>('[data-headline]');
const heroRule = must<HTMLElement>('[data-hero-rule]');
const heroFades = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-fade]'));
const heroPanel = must<HTMLElement>('[data-hero-panel]');

const menuToggle = must<HTMLButtonElement>('[data-menu-toggle]');
const mobileMenu = must<HTMLElement>('[data-mobile-menu]');

// ---------------------------------------------------------------------------
// Easing: slow, weighted, never any overshoot
// ---------------------------------------------------------------------------

const EASE = {
  settle: 'expo.out',
  enter: 'power3.out',
} as const;

const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

// ---------------------------------------------------------------------------
// State owned by the active matchMedia context
// ---------------------------------------------------------------------------

let lenis: Lenis | null = null;
let introPlayed = false;
const revealed = new WeakSet<Element>();

const timeout = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function decoded(img: HTMLImageElement, ms: number): Promise<void> {
  const ready =
    img.complete && img.naturalWidth > 0
      ? img.decode()
      : new Promise<void>((resolve) => {
          img.addEventListener('load', () => img.decode().then(resolve, resolve), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        });
  return Promise.race([ready.catch(() => undefined), timeout(ms)]);
}

function fontsReady(ms: number): Promise<void> {
  return Promise.race([document.fonts.ready.then(() => undefined), timeout(ms)]);
}

// ---------------------------------------------------------------------------
// Hero: load intro (time-based)
// ---------------------------------------------------------------------------

function playIntro(lines: Element[]): void {
  gsap.set(heroHeadline, { visibility: 'visible' });

  if (introPlayed) {
    gsap.set(heroImgBox, { opacity: 1, scale: 1, willChange: 'auto' });
    gsap.set([...heroFades, heroPanel], { opacity: 1 });
    gsap.set(heroRule, { scaleX: 1 });
    return;
  }

  gsap
    .timeline({
      onComplete: () => {
        introPlayed = true;
        gsap.set(heroImgBox, { willChange: 'auto' });
      },
    })
    .fromTo(heroImgBox, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: 'power2.out' }, 0)
    .fromTo(heroImgBox, { scale: 1.06 }, { scale: 1, duration: 2.4, ease: EASE.settle }, 0)
    .fromTo(heroFades[0], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.2, ease: EASE.enter }, 0.45)
    .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: 0.12, ease: EASE.enter }, 0.6)
    .fromTo(heroRule, { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: EASE.settle }, 1.2)
    .fromTo(heroFades.slice(1), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: EASE.enter }, 1.35)
    .fromTo(heroPanel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.3, ease: EASE.enter }, 1.0);
}

// ---------------------------------------------------------------------------
// Slow scroll: every photo moves slower than the page (as on hype.luxury).
//
// The photo box is exactly the size of its section, never enlarged. Its offset
// is a fraction (k) of the section's distance from the top of the viewport, so
// any edge it exposes is always off-screen or behind the header, provided the
// section is at least one viewport tall (photo sections are min-height 100svh).
// ---------------------------------------------------------------------------

function buildSlowScroll(k: number): void {
  // Hero: the photo lags behind as the hero scrolls away, and darkens a touch.
  gsap.fromTo(
    heroImgBox,
    { y: 0 },
    {
      y: () => k * hero.offsetHeight,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    },
  );
  gsap.fromTo(
    heroShade,
    { opacity: 0 },
    {
      opacity: 0.5,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    },
  );

  // Photo sections: the photo trails the page on the way in and on the way out,
  // while the text drifts slightly the other way for depth.
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
    const section = img.closest('section')!;
    const content = section.querySelector<HTMLElement>('.photo-section__content');
    const trigger = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true };

    gsap.fromTo(
      img,
      { y: () => -k * window.innerHeight },
      { y: () => k * section.offsetHeight, ease: 'none', scrollTrigger: trigger },
    );
    if (content) gsap.fromTo(content, { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { ...trigger } });
  });
}

// ---------------------------------------------------------------------------
// Section reveals
// ---------------------------------------------------------------------------

function buildReveals(): SplitText[] {
  const splits: SplitText[] = [];

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    split.masks.forEach((m) => m.classList.add('split-mask'));
    splits.push(split);
    gsap.set(el, { visibility: 'visible' });
    if (revealed.has(el)) return;
    gsap.fromTo(
      split.lines,
      { yPercent: 108 },
      {
        yPercent: 0,
        duration: 1.3,
        stagger: 0.1,
        ease: EASE.enter,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true, onEnter: () => revealed.add(el) },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (revealed.has(el)) return gsap.set(el, { opacity: 1 });
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: EASE.enter,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true, onEnter: () => revealed.add(el) },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = Array.from(group.children);
    if (revealed.has(group)) return gsap.set(items, { opacity: 1 });
    gsap.fromTo(
      items,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: EASE.enter,
        scrollTrigger: { trigger: group, start: 'top 88%', once: true, onEnter: () => revealed.add(group) },
      },
    );
  });

  return splits;
}

// ---------------------------------------------------------------------------
// Contexts
// ---------------------------------------------------------------------------

function setupMotion(context: gsap.Context, isMobile: boolean): () => void {
  root.classList.add('has-motion');
  let alive = true;
  let splits: SplitText[] = [];

  lenis = new Lenis({ lerp: LENIS_LERP, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  Promise.all([decoded(heroImg, 1600), fontsReady(1200)]).then(() => {
    if (!alive) return;
    context.add(() => {
      const heroSplit = SplitText.create(heroHeadline, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      heroSplit.masks.forEach((m) => m.classList.add('split-mask'));
      splits.push(heroSplit);

      playIntro(heroSplit.lines);
      buildSlowScroll(isMobile ? SLOW_SCROLL.mobile : SLOW_SCROLL.desktop);
      splits = splits.concat(buildReveals());
      ScrollTrigger.refresh();

      if (location.hash.length > 1) scrollToHash(location.hash, true);
    });
  });

  return () => {
    alive = false;
    splits.forEach((s) => s.revert());
    gsap.ticker.remove(raf);
    gsap.ticker.lagSmoothing(500, 33);
    lenis?.destroy();
    lenis = null;
  };
}

function setupStatic(): () => void {
  // Reduced motion: no smooth scroll, no pin, no parallax. Everything visible.
  root.classList.remove('has-motion');
  return () => undefined;
}

gsap.matchMedia().add(
  {
    isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    isMobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    reduceMotion: '(prefers-reduced-motion: reduce)',
  },
  (context) => {
    const { isDesktop, isMobile } = context.conditions as Record<string, boolean>;
    if (isDesktop || isMobile) return setupMotion(context, !!isMobile);
    return setupStatic();
  },
);

// ---------------------------------------------------------------------------
// In-page navigation
// ---------------------------------------------------------------------------

function scrollToHash(hash: string, immediate = false): void {
  if (hash === '#top' || hash === '#') {
    if (lenis) lenis.scrollTo(0, { duration: 1.6, easing: easeInOutQuart, immediate });
    else window.scrollTo({ top: 0 });
    return;
  }
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const focusTarget = () => {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  // Both paths respect html { scroll-padding-top: header height } in main.css,
  // so the target lands just below the fixed black header.
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8, easing: easeInOutQuart, immediate, onComplete: focusTarget });
  } else {
    target.scrollIntoView({ block: 'start' });
    focusTarget();
  }
}

const quoteForm = initQuoteForm(must<HTMLFormElement>('[data-quote-form]'));

// Links from inner pages can open a specific tab: /?enquiry=buy#quote
const enquiry = new URLSearchParams(location.search).get('enquiry');
if (enquiry === 'fly' || enquiry === 'buy' || enquiry === 'sell') quoteForm.selectTab(enquiry);
initContactForm(must<HTMLFormElement>('[data-contact-form]'));
initFaq(must<HTMLElement>('[data-faq]'));

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute('href')!;
  event.preventDefault();
  if (link.dataset.quoteTab) quoteForm.selectTab(link.dataset.quoteTab);
  closeMenu();
  scrollToHash(hash);
  history.replaceState(null, '', hash === '#top' ? location.pathname : hash);
});

// ---------------------------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------------------------

function openMenu(): void {
  mobileMenu.hidden = false;
  menuToggle.setAttribute('aria-expanded', 'true');
  lenis?.stop();
  document.body.style.overflow = 'hidden';
  gsap.fromTo(mobileMenu, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  gsap.fromTo(
    mobileMenu.querySelectorAll('.mobile-menu__list li'),
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: EASE.enter },
  );
}

function closeMenu(): void {
  if (mobileMenu.hidden) return;
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  lenis?.start();
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => (mobileMenu.hidden ? openMenu() : closeMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileMenu.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => e.matches && closeMenu());

// ---------------------------------------------------------------------------
// Refresh
// ---------------------------------------------------------------------------

let lastWidth = window.innerWidth;
let resizeTimer = 0;
window.addEventListener('resize', () => {
  if (window.innerWidth === lastWidth) return;
  lastWidth = window.innerWidth;
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
