module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  reportUnusedDisableDirectives: true,
  plugins: [
    '@typescript-eslint',
    'react',
    'prettier',
    'jest',
    'react-hooks',
    'testing-library',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/react',
    'plugin:jest/recommended',
    'plugin:testing-library/react',
  ],
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
  },
  rules: {
    'jest/valid-title': 'off',
    'jest/expect-expect': 'off',
    'jest/no-disabled-tests': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
};
