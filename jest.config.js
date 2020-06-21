const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', compilerOptions.baseUrl],
};
