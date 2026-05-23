module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/tests'],

  testMatch: ['**/*.spec.ts'],

  collectCoverage: true,

  coverageDirectory: 'coverage',

  moduleFileExtensions: ['ts', 'js', 'json'],

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};