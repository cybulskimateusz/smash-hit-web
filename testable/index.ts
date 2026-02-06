import 'reflect-metadata';

import type World from '@src/World';

import type TestableScene from './TestableScene';

export function resolveTarget(instance: object, path: string): { obj: object; key: string } {
  const parts = path.split('.');
  const key = parts.pop()!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = parts.reduce((acc, part) => (acc as any)[part], instance);
  return { obj: obj as object, key };
}

interface TestableRegistryItem {
    path: string;
    controller: new (world: World, canvas: HTMLCanvasElement) => TestableScene;
}

declare global {
    interface Window {
        testableRegistry: TestableRegistryItem[];
    }
}

window.testableRegistry = window.testableRegistry || [];

export function Testable(path: string) {
  return function <
    T extends new (world: World, canvas: HTMLCanvasElement) => TestableScene
  >(controller: T) {
    window.testableRegistry.push({
      path,
      controller,
    });
  };
}