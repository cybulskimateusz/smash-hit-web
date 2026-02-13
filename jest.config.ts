import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@desktop/(.*)$': '<rootDir>/src/desktop/$1',
    '^@mobile/(.*)$': '<rootDir>/src/mobile/$1',
    '^@testable/(.*)$': '<rootDir>/testable/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.test.json' }],
  },
};

export default config;
