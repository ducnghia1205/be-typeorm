/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    "interfaces",
    ".module.ts",
    "<rootDir>/src/app.ts",
    ".mock.ts"
  ],
};
