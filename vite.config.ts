import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base: the built site works at any address, whether that's
  // https://<user>.github.io/<repo>/, the root of a domain, or a custom domain.
  base: './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
});
