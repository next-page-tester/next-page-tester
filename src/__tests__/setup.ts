import '@testing-library/jest-dom';
// @NOTE Import path must finish with "./src" to correctly configure /dist tests
import { initTestHelpers } from '../../src';
initTestHelpers();

afterEach(() => {
  // Clear all cookies
  if (document.cookie !== '') {
    document.cookie.split(';').forEach(function (v) {
      document.cookie = v
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }
});
