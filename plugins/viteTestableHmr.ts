// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { Plugin } from 'vite';

const viteTestableHmr = (): Plugin => ({
  name: 'vite-plugin-testable-hmr',
  configureServer(server) {
    server.watcher.on('add', (file) => {
      if (file.endsWith('.testable.ts')) {
        server.ws.send({ type: 'full-reload', path: '*' });
      }
    });
  }
});

export default viteTestableHmr;