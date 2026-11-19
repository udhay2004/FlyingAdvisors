import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Served from the root of https://flyingadvisors.com. Absolute paths keep
  // assets working on deeper URLs (the 404 page, and future inner pages).
  base: '/',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    // scripts/build-pages.mjs reads the manifest to link the inner-page bundle.
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
        // Inner pages are written by scripts/build-pages.mjs after this build.
        inner: resolve(import.meta.dirname, 'src/inner.ts'),
      },
    },
  },
});
