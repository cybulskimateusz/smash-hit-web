declare module 'glslify' {
  interface GlslifyOptions {
    basedir?: string;
    transform?: string[] | Array<[string, unknown]>;
    [key: string]: unknown;
  }

  interface GlslifyFunction {
    (source: string, options?: GlslifyOptions): string;
    compile(source: string, options?: GlslifyOptions): string;
    file(filename: string, options?: GlslifyOptions): string;
  }

  const glslify: GlslifyFunction;
  export = glslify;
}
