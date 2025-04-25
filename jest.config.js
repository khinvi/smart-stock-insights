module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
      '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/__mocks__/fileMock.js'
    },
    transform: {
      '^.+\\.js$': 'babel-jest'
    },
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/background.js',
      '!src/content.js'
    ]
  };