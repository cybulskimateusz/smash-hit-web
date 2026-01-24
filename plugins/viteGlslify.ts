// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import glslify from 'glslify';
import path from 'path';
import type { Plugin } from 'vite';

// vite-plugin-glslify throws dependency error
export const viteGlslify = (): Plugin => ({
  name: 'vite-plugin-glslify',
  transform(code, id) {
    if (!/\.(glsl|vert|frag)$/.test(id)) return null;
    try {
      const compiled = glslify.compile(code, {
        basedir: path.dirname(id),
        transform: []
      });
      return { code: `export default ${JSON.stringify(compiled)}`, map: null };
    } catch (error) {
      this.error(`Glslify compilation failed: ${error}`);
    }
  },
  handleHotUpdate({ file, server }) {
    if (/\.(glsl|vert|frag)$/.test(file)) {
      server.ws.send({ type: 'full-reload', path: '*' });
    }
  }
});