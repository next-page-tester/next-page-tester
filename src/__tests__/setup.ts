import '@testing-library/jest-dom';
import { initTestHelpers } from '../index';
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
