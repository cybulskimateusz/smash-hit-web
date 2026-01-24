// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import path from 'path';
import { defineConfig } from 'vite';

import { viteGlslify } from './plugins/viteGlslify';

export default defineConfig({
  root: path.resolve(__dirname, 'testable'),
  resolve: {
    alias: {
      '@testable': path.resolve(__dirname, 'testable'),
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
  plugins: [viteGlslify()]
});
