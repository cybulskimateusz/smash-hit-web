import 'reflect-metadata';

import type App from '@src/App';
import * as THREE from 'three';

interface TestableParams {
    path: string;
    useOrbitControls?: boolean;
    useFbnBackground?: boolean;
}

export interface ExposeOptions {
    min?: number;
    max?: number;
    step?: number;
    folder?: string;
    target?: string;
}

export interface ExposedProperty {
    key: string;
    options: ExposeOptions;
}

export function resolveTarget(instance: object, path: string): { obj: object; key: string } {
  const parts = path.split('.');
  const key = parts.pop()!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = parts.reduce((acc, part) => (acc as any)[part], instance);
  return { obj: obj as object, key };
}

interface TestableRegistryItem {
    params: TestableParams;
    controller: new (app: App) => THREE.Object3D;
}

declare global {
    interface Window {
        testableRegistry: TestableRegistryItem[];
    }
}

window.testableRegistry = window.testableRegistry || [];

const EXPOSED_KEY = Symbol('exposed');

export function Expose(options: ExposeOptions = {}) {
  return function (target: object, propertyKey: string) {
    const existing: ExposedProperty[] = Reflect.getMetadata(EXPOSED_KEY, target) || [];
    existing.push({ key: propertyKey, options });
    Reflect.defineMetadata(EXPOSED_KEY, existing, target);
  };
}

export function getExposedProperties(instance: object): ExposedProperty[] {
  return Reflect.getMetadata(EXPOSED_KEY, instance) || [];
}

export function Testable(params: TestableParams) {
  return function (constructor: new (app: App) => THREE.Object3D) {
    window.testableRegistry.push({
      params: {
        path: params.path,
        useOrbitControls: params.useOrbitControls || false,
        useFbnBackground: params.useFbnBackground || false
      },
      controller: constructor
    });
  };
}
