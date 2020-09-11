# Next page tester

[![Build status][ci-badge]][ci]
[![Npm version][npm-badge]][npm]
[![Test coverage report][coveralls-badge]][coveralls]

The missing unit testing tool for [Next.js][next-github].

Given a Next route, this library will return an instance of the matching page component instantiated with the **properties** derived from [**routing system**][next-docs-routing] and [**server side data fetching**][next-docs-data-fetching].

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

The idea behind this library is to unit test Next.js pages along with its [server side data fetching][next-docs-data-fetching] and [routing][next-docs-routing] logic in one go.

The testing approach suggested here consists of mocking external API's and get the resulting component instance matching a given route.

Next page tester will take care of:

- **resolving** provided **routes** into matching page components
- optionally calling **data fetching methods** (`getServerSideProps` or `getStatic Props`)
- **instantiating** page component with the **expected props**

## Options

| Property           | Description                                                                        | type               | Default |
| ------------------ | ---------------------------------------------------------------------------------- | ------------------ | ------- |
| **route**          | Next route (must start with `/`)                                                   | -                  | -       |
| **pagesDirectory** | Absolute path of Next's `/pages` folder                                            | -                  | -       |
| **req**            | Override default mocked [request object][req-docs]<br>(`getServerSideProps` only)  | `res => res`       | -       |
| **res**            | Override default mocked [response object][res-docs]<br>(`getServerSideProps` only) | `req => req`       | -       |
| **router**         | Override default mocked Next router object                                         | `router => router` | -       |

## Notes

`req` and `res` objects are mocked with [node-mocks-http][node-mocks-http].

## Todo's

- Make available dynamic api routes under `/pages/api`
- Consider adding custom App and Document
- Get `next/router` (especially `withRouter` and `useRouter`) to work
- Switch to Typescript

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
