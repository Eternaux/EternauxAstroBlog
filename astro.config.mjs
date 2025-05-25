// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.eternaux.com',
  base: '/',
  integrations: [react()],
  build: {
    format: 'file'
  },
  output: 'static',
  trailingSlash: 'never'
});
