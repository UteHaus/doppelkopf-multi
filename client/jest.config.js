module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@app/(.*)$': '<rootDir>/src/app/$1',
    '@environments/(.*)$': '<rootDir>/src/environments/$1'
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
