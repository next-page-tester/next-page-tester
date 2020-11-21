# Next page tester

[![Build status][ci-badge]][ci]
[![Test coverage report][coveralls-badge]][coveralls]
[![Npm version][npm-badge]][npm]

The missing DOM integration testing tool for [Next.js][next-github].

Given a Next.js route, this library will return an instance of the matching page component instantiated with the **properties** derived by Next.js' [**routing system**][next-docs-routing] and [**server side data fetching**][next-docs-data-fetching].

```js
import { render, screen, userEvent } from '@testing-library/react';
import { getPage } from 'next-page-tester';

describe('Blog page', () => {
  it('renders blog page', async () => {
    const Page = await getPage({
      route: '/blog/1',
    });

    render(Page);
    expect(screen.getByText('Blog')).toBeInTheDocument();

    userEvent.click(screen.getByText('Link'));
    await screen.findByText('Linked page');
  });
});
```

## What

The idea behind this library is to enable DOM integration tests on Next.js pages along with [server side data fetching][next-docs-data-fetching] and [routing][next-docs-routing].

The testing approach suggested here consists of manually mocking external API's dependencies and get the component instance matching a given route.

Next page tester will take care of:

- **resolving** provided **routes** into matching page component
- calling **Next.js data fetching methods** (`getServerSideProps`, `getInitialProps` or `getStaticProps`) if the case
- set up a **mocked `next/router` provider** initialized with the expected values (to test `useRouter` and `withRouter`)
- wrapping page with custom `_app` component
- **instantiating** page component with **expected page props**
- Emulate client side navigation via `Link`, `router.push`, `router.replace`

## Options

| Property              | Description                                                                      | type               | Default         |
| --------------------- | -------------------------------------------------------------------------------- | ------------------ | --------------- |
| **route** (mandatory) | Next route (must start with `/`)                                                 | `string`           | -               |
| **req**               | Access default mocked [request object][req-docs]<br>(`getServerSideProps` only)  | `res => res`       | -               |
| **res**               | Access default mocked [response object][res-docs]<br>(`getServerSideProps` only) | `req => req`       | -               |
| **router**            | Access default mocked [Next router object][next-docs-router]                     | `router => router` | -               |
| **useCustomApp**      | Use [custom App component][next-docs-custom-app]                                 | `boolean`          | `false`         |
| **nextRoot**          | Absolute path to Next's root folder                                              | `string`           | _auto detected_ |

## Notes

- Data fetching methods' context `req` and `res` objects are mocked with [node-mocks-http][node-mocks-http]
- Next page tester can be used with any testing framework/library (not tied to Testing library)
- It might be necessary to install `@types/react-dom` and `@types/webpack` when using Typescript in `strict` mode due to [this bug][next-gh-strict-bug]

### Error: Not implemented: window.scrollTo

Next.js `Link` components invoke `window.scrollTo` on click which is not implemented in JSDOM environment. In order to fix the error you should provide [your own `window.scrollTo` mock](https://qiita.com/akameco/items/0edfdae02507204b24c8).

## Todo's

- Consider adding custom Document support
- Consider reusing Next.js code parts (not only types)
- Consider supporting Next.js `trailingSlash` option

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
[next-gh-strict-bug]: https://github.com/vercel/next.js/issues/16219
