var pkg = require('../package.json');

module.exports = Object.assign({}, pkg.jest, {
  rootDir: '../',
  moduleNameMapper: {
    ...pkg.jest.moduleNameMapper,
    './src$': 'next-page-tester-on-npm',
  },
});
