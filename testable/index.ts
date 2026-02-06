import type World from '@src/core/World';

import TestableScene from './TestableScene';

export function resolveTarget(instance: object, path: string): { obj: object; key: string } {
  const parts = path.split('.');
  const key = parts.pop()!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = parts.reduce((acc, part) => (acc as any)[part], instance);
  return { obj: obj as object, key };
}

export interface TestableClass {
  new (world: World, canvas: HTMLCanvasElement): TestableScene;
  path: string;
}

export interface TestableRegistryItem {
  path: string;
  controller: TestableClass;
}

declare global {
  interface Window {
    testableRegistry: TestableRegistryItem[];
  }
}

window.testableRegistry = window.testableRegistry || [];

export function registerTestables(modules: Record<string, unknown>) {
  for (const [filePath, module] of Object.entries(modules)) {
    const exports = module as { default?: unknown };
    const Controller = exports.default;

    if (!Controller || typeof Controller !== 'function') {
      throw new Error(`Testable file ${filePath} must have a default export`);
    }

    if (!(Controller.prototype instanceof TestableScene)) {
      throw new Error(`Testable ${filePath} must extend TestableScene`);
    }

    const TestableController = Controller as TestableClass;

    if (!TestableController.path) {
      throw new Error(`Testable ${filePath} must define static path property`);
    }

    window.testableRegistry.push({
      path: TestableController.path,
      controller: TestableController,
    });
  }
}