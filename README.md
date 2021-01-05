# Next page tester

[![Build status][ci-badge]][ci]
[![Test coverage report][coveralls-badge]][coveralls]
[![Npm version][npm-badge]][npm]

The missing DOM integration testing tool for [Next.js][next-github].

Given a Next.js route, this library will return an instance of the matching page component instantiated with the **properties** derived by Next.js' [**routing system**][next-docs-routing] and [**data fetching methods**][next-docs-data-fetching].

```js
import { render, screen, fireEvent } from '@testing-library/react';
import { getPage } from 'next-page-tester';

describe('Blog page', () => {
  it('renders blog page', async () => {
    const { page } = await getPage({
      route: '/blog/1',
    });

    render(page);
    expect(screen.getByText('Blog')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Link'));
    await screen.findByText('Linked page');
  });
});
```

## What

The idea behind this library is to enable DOM integration tests on Next.js pages along with [data fetching][next-docs-data-fetching] and [routing][next-docs-routing].

The testing approach suggested here consists of manually mocking external API's dependencies and get the component instance matching a given route.

Next page tester will take care of:

- **resolving** provided **routes** into matching page component
- calling **Next.js data fetching methods** (`getServerSideProps`, `getInitialProps` or `getStaticProps`) if the case
- set up a **mocked `next/router` provider** initialized with the expected values (to test `useRouter` and `withRouter`)
- wrapping page with custom `_app` and `_document` components
- **instantiating** page component with **expected page props**
- emulating client side navigation via `Link`, `router.push`, `router.replace`
- handling pages' `redirect` returns

## Options

| Property                       | Description                                                   | type               | Default         |
| ------------------------------ | ------------------------------------------------------------- | ------------------ | --------------- |
| **route** (mandatory)          | Next route (must start with `/`)                              | `string`           | -               |
| **req**                        | Enhance default mocked [request object][req-docs]             | `req => req`       | -               |
| **res**                        | Enhance default mocked [response object][res-docs]            | `res => res`       | -               |
| **router**                     | Enhance default mocked [Next router object][next-docs-router] | `router => router` | -               |
| **useApp**                     | Render [custom App component][next-docs-custom-app]           | `boolean`          | `true`          |
| **useDocument** (experimental) | Render [Document component][next-docs-custom-document]        | `boolean`          | `false`         |
| **nextRoot**                   | Absolute path to Next.js root folder                          | `string`           | _auto detected_ |

## Set up your test environment

Since Next.js is not designed to run in a JSDOM environment we need to **tweak the default JSDOM environment** to avoid unexpected errors and allow a smoother testing experience:

- Provide a `window.scrollTo` mock
- Provide a `IntersectionObserver` mock
- Silence `validateDOMNesting(...)` error
- Remove initial `<head/>` element
- Resolve `next/dist/next-server/lib/side-effect` module in non-brwoser environment

Next page tester provides a [helper to setup the expected JSDOM environment](/src/testHelpers.ts) as described.

Run `initTestHelpers` in your global tests setup (in case of Jest It is `setupFilesAfterEnv` file):

```js
import { initTestHelpers } from 'next-page-tester';
initTestHelpers();
```

### If `useDocument` option enabled

In case your tests make use of **experimental `useDocument` option**, take the following additional steps:

```js
import { initTestHelpers } from 'next-page-tester';
const { setup, teardown } = initTestHelpers();

beforeAll(() => {
  setup();
});

afterAll(() => {
  teardown();
});
```

### Optional: patch Jest

Until **Jest v27** is published, you might need to patch `jest` in order to load modules with [proper server/client environments](#73). _Don't do this until you actually encounter issues_.

1. Install [`patch-package`](https://www.npmjs.com/package/patch-package) and follow its setup instructions
2. Manually update `node_modules/jest-runtime/build/index.js` file and replicate [this commit](https://github.com/facebook/jest/commit/e5a84d92fc906a5bb140f9753b644319cea095da#diff-c0d5b59e96fdc7ffc98405e8afb46d525505bc7b1c24916b5c8482de5a186c00)
3. Run `npx patch-package jest-runtime` or `yarn patch-package jest-runtime`

## Notes

- Data fetching methods' context `req` and `res` objects are mocked with [node-mocks-http][node-mocks-http]
- Next page tester can be used with any testing framework/library (not tied to Testing library)
- It might be necessary to install `@types/react-dom` and `@types/webpack` when using Typescript in `strict` mode due to [this bug][next-gh-strict-bug]

### Experimental `useDocument` option

`useDocument` option is partially implemented and might be unstable. It might produce a `UnhandledPromiseRejectionWarning` warning on client side navigation.

### Next.js versions support

`next-page-tester` focuses on supporting only the last major version of Next.js:

| next-page-tester | next.js |
| ---------------- | ------- |
| v0.1.0 - v0.7.0  | v9.X.X  |
| v0.8.0 +         | v10.X.X |

## FAQ

### How do I make cookies available in Next.js data fetching methods?

You can set cookies by appending them to `document.cookie` before calling `getPage`. `next-page-tester` will propagate cookies to `ctx.req.headers.cookie` so they will be available to data fetching methods. This also applies to subsequent fetching methods calls triggered by client side navigation.

```ts
test('authenticated page', async () => {
  document.cookie = 'SessionId=super=secret';
  document.cookie = 'SomeOtherCookie=SomeOtherValue';

  const { page } = await getPage({
    route: '/authenticated',
  });
});
```

Note: `document.cookie` does not get cleaned up automatically. You'll have to clear it manually after each test to keep everything in isolation.

### Error: Not implemented: window.scrollTo

Next.js `Link` component invokes `window.scrollTo` on click which is not implemented in JSDOM environment. In order to fix the error you should provide [your own `window.scrollTo` mock](https://qiita.com/akameco/items/0edfdae02507204b24c8).

### `useDocument` option and `validateDOMNesting(...)` error

Rendering the page instance returned by `next-page-tester` with `useDocument` option enabled in a JSDOM environment, causes `react-dom` to trigger a `validateDOMNesting(...)` error.

This happens because the tested page includes tags like `<html>`, `<head>` and `<body>` which are already declared by JSDOM default document.

A temporary workaround consists of [mocking global `console.error` to ignore the specific error][error-log-mock].

## Todo's

- Consider reusing Next.js code parts (not only types)
- Consider supporting Next.js `trailingSlash` option

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.andreacarraro.it"><img src="https://avatars3.githubusercontent.com/u/4573549?v=4" width="100px;" alt=""/><br /><sub><b>Andrea Carraro</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/commits?author=toomuchdesign" title="Code">💻</a> <a href="#infra-toomuchdesign" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/toomuchdesign/next-page-tester/commits?author=toomuchdesign" title="Tests">⚠️</a> <a href="#maintenance-toomuchdesign" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://www.matej.snuderl.si/"><img src="https://avatars3.githubusercontent.com/u/8524109?v=4" width="100px;" alt=""/><br /><sub><b>Matej Šnuderl</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/commits?author=Meemaw" title="Code">💻</a> <a href="#infra-Meemaw" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/toomuchdesign/next-page-tester/commits?author=Meemaw" title="Tests">⚠️</a> <a href="https://github.com/toomuchdesign/next-page-tester/pulls?q=is%3Apr+reviewed-by%3AMeemaw" title="Reviewed Pull Requests">👀</a> <a href="#ideas-Meemaw" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/toomuchdesign/next-page-tester/commits?author=Meemaw" title="Documentation">📖</a></td>
    <td align="center"><a href="https://jason-williams.co.uk"><img src="https://avatars3.githubusercontent.com/u/936006?v=4" width="100px;" alt=""/><br /><sub><b>Jason Williams</b></sub></a><br /><a href="#ideas-jasonwilliams" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- ALL-CONTRIBUTORS-BADGE:START -->
<!-- prettier-ignore-start -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-BADGE:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[ci]: https://travis-ci.com/toomuchdesign/next-page-tester
[ci-badge]: https://travis-ci.com/toomuchdesign/next-page-tester.svg?branch=master
[npm]: https://www.npmjs.com/package/next-page-tester
[npm-badge]: https://img.shields.io/npm/v/next-page-tester.svg
[coveralls-badge]: https://coveralls.io/repos/github/toomuchdesign/next-page-tester/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/toomuchdesign/next-page-tester?branch=master
[next-github]: https://nextjs.org/
[req-docs]: https://nodejs.org/api/http.html#http_class_http_clientrequest
[res-docs]: https://nodejs.org/api/http.html#http_class_http_serverresponse
[node-mocks-http]: https://www.npmjs.com/package/node-mocks-http
[next-docs-routing]: https://nextjs.org/docs/routing/introduction
[next-docs-data-fetching]: https://nextjs.org/docs/basic-features/data-fetching
[next-docs-router]: https://nextjs.org/docs/api-reference/next/router
[next-docs-custom-app]: https://nextjs.org/docs/advanced-features/custom-app
[next-docs-custom-document]: https://nextjs.org/docs/advanced-features/custom-document
[next-gh-strict-bug]: https://github.com/vercel/next.js/issues/16219
[error-log-mock]: src/__tests__/use-document/use-document.test.tsx#L8
