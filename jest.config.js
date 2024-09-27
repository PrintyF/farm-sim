module.exports = {
  testEnvironment: 'jsdom',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['./src/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  fakeTimers: {
    enableGlobally: true,
  }
};