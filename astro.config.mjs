// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.eternaux.com',
  base: '/',
  integrations: [react()],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file'
  },
  experimental: {
    clientPrerender: true
  }
});
