# Next page tester

[![Build status][ci-badge]][ci]
[![Test coverage report][coveralls-badge]][coveralls]
[![Npm version][npm-badge]][npm]

The missing DOM integration testing tool for [Next.js][next-github].

Given a Next.js route, this library will return an instance of the matching page component instantiated with the **properties** derived by Next.js' [**routing system**][next-docs-routing] and [**server side data fetching**][next-docs-data-fetching].

```js
import { render, screen } from '@testing-library/react';
import { getPage } from 'next-page-tester';

describe('Blog page', () => {
  it('renders blog page', async () => {
    const Page = await getPage({
      route: '/blog/1',
      pagesDirectory: process.cwd() + '/src/pages',
    });

    render(Page);
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });
});
```

## What

The idea behind this library is to enable integration tests on Next.js pages including [server side data fetching][next-docs-data-fetching] and [routing][next-docs-routing].

The testing approach suggested here consists of manually mocking external API's and get the component instance matching a given route.

Next page tester will take care of:

- **resolving** provided **routes** into the matching page component
- calling **Next.js data fetching methods** (`getServerSideProps` or `getStaticProps`) if the case
- set up a **mocked `next/router` provider** initialized with the expected values (to test `useRouter` and `withRouter`)
- **instantiating** the page component with the **expected props**

## Options

| Property           | Description                                                                        | type               | Default |
| ------------------ | ---------------------------------------------------------------------------------- | ------------------ | ------- |
| **route**          | Next route (must start with `/`)                                                   | -                  | -       |
| **pagesDirectory** | Absolute path of Next's `/pages` folder                                            | -                  | -       |
| **req**            | Override default mocked [request object][req-docs]<br>(`getServerSideProps` only)  | `res => res`       | -       |
| **res**            | Override default mocked [response object][res-docs]<br>(`getServerSideProps` only) | `req => req`       | -       |
| **router**         | Override default mocked [Next router object][next-docs-router]                     | `router => router` | -       |

## Notes

`req` and `res` objects are mocked with [node-mocks-http][node-mocks-http].

Next page tester can be used with any testing framework/library.

## Todo's

- Make available dynamic api routes under `/pages/api`
- Consider adding custom App and Document
- Switch to Typescript
- Consider adding a `getPage` factory

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
