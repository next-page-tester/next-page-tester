# Next page tester

[![Build status][ci-badge]][ci]
[![Npm version][npm-badge]][npm]

The missing unit testing tool for [Next.js][next-github]]. Given a route, the matching page component is returned with the **properties** derived from **dynamic routing** and **server side data fetching** results.

```js
import { render, screen } from '@testing-library/react';
import { getPage } from 'next-tester';

describe('Blog page', () => {
  it('renders blog page', async () => {
    const Page = await getPage({
      route: '/blog/1',
      pagesDirectory: process.cwd() + '/src/pages',
    });

    render(<Page />);
    expect(screen.getByText(Blog)).toBeInTheDocument();
  });
});
```

## What

The idea behind this library is to provide a smooth unit testing experience with Next.js.

The testing approach suggested here consists of mocking external API's responses and get the component instance matching a given route.

Next page tester will take care of:

- **resolving** the provided **route** into the matching page component
- optionally calling **data fetching methods** (`getServerSideProps` or `getStatic Props`)
- **instantiating** page component with the **expected `props`**

## Options

| Property              | Description                                                                                | Default |
| --------------------- | ------------------------------------------------------------------------------------------ | ------- |
| **route**             | Next route (must start with `/`)                                                           | -       |
| **pagesDirectory**    | Absolute path of Next's `/pages` folder                                                    | -       |
| **req**               | Override default mocked [HTTP request object][req-docs] props (`getServerSideProps` only)  | -       |
| **pagresesDirectory** | Override default mocked [HTTP response object][res-docs] props (`getServerSideProps` only) | -       |

## Notes

`req` and `res` objects are mocked with [node-mocks-http][node-mocks-http].

## Todo's

- Catch all routes
- Make dynamic api routes under `/pages/api` available
- Consider adding custom App and Document
- Get `next/router` (especially `withRouter` and `useRouter`) to work
- Switch to Typescript

[ci]: https://travis-ci.com/toomuchdesign/next-page-tester
[ci-badge]: https://travis-ci.com/toomuchdesign/next-page-tester.svg?branch=master
[npm]: https://www.npmjs.com/package/next-page-tester
[npm-badge]: https://img.shields.io/npm/v/next-page-tester.svg
[next-github]: https://nextjs.org/
[req-docs]: https://nodejs.org/api/http.html#http_class_http_clientrequest
[res-docs]: https://nodejs.org/api/http.html#http_class_http_serverresponse
[node-mocks-http]: https://www.npmjs.com/package/node-mocks-http
