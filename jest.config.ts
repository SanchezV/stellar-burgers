/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    // множество разных настроек
  transform: {
    // '^.+\\.[tj]sx?$' для обработки файлов js/ts с помощью `ts-jest`
    // '^.+\\.m?[tj]sx?$' для обработки файлов js/ts/mjs/mts с помощью `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
          // настройки для ts-jest
          // Indicates whether the coverage information should be collected while executing the test
          collectCoverage: true,

          // The directory where Jest should output its coverage files
          coverageDirectory: "coverage",

          // Indicates which provider should be used to instrument code for coverage
          coverageProvider: "v8",

          preset: 'ts-jest',
      },
    ],
  },
    moduleNameMapper: {
    "^@api$": "<rootDir>/src/utils/burger-api.ts",
    // Можно добавить другие алиасы, если есть
  },
};

export default config;