module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/tests'],

  testMatch: ['**/*.spec.ts'],

  collectCoverage: true,

  collectCoverageFrom: [
    'src/**/*.service.ts',
    'src/**/*.controller.ts',
    '!src/**/*.module.ts'
  ],

  coverageDirectory: 'coverage',

  moduleFileExtensions: ['ts', 'js', 'json'],

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};