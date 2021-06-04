import '@testing-library/jest-dom';

afterEach(() => {
  // Clear all cookies
  if (global.document && document.cookie !== '') {
    document.cookie.split(';').forEach(function (v) {
      document.cookie = v
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }
});
