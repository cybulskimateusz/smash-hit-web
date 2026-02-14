// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import path from 'path';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

import viteGlslify from './plugins/viteGlslify';
import viteTestableHmr from './plugins/viteTestableHmr';

export default defineConfig({
  root: path.resolve(__dirname, 'testable'),
  resolve: {
    alias: {
      '@testable': path.resolve(__dirname, 'testable'),
      '@src': path.resolve(__dirname, 'src'),
      '@desktop': path.resolve(__dirname, 'src/desktop'),
      '@mobile': path.resolve(__dirname, 'src/mobile'),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
  plugins: [wasm(), viteGlslify(), viteTestableHmr()]
});
