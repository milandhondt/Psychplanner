import type { Config } from 'jest';

const config: Config = {
  coverageProvider: 'v8',
  testMatch: [
    '**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  preset: 'ts-jest',
  collectCoverageFrom: [
    './src/service/**/*.ts',
    './src/rest/**/*.ts',
  ],
  coverageDirectory: '__tests__/coverage',
};

export default config;
