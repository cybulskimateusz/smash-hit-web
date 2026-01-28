// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import path from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viteTestableHmr = (): Plugin => ({
  name: 'vite-plugin-testable-hmr',
  configureServer(server) {
    // Watch the src directory for new testable files (relative to project root)
    const srcDir = path.resolve(__dirname, '..', 'src');
    server.watcher.add(srcDir);

    server.watcher.on('add', (file) => {
      if (file.endsWith('.testable.ts')) {
        server.ws.send({ type: 'full-reload', path: '*' });
      }
    });
  }
});

export default viteTestableHmr;