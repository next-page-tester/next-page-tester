# Next page tester

[![Build status][ci-badge]][ci]
[![Test coverage report][coveralls-badge]][coveralls]
[![Npm version][npm-badge]][npm]

The missing DOM integration testing tool for [Next.js][next-github].

Given a Next.js route, this library will **render the matching page in JSDOM**, provided with the expected **props** derived from Next.js' [**routing system**][next-docs-routing] and [**data fetching methods**][next-docs-data-fetching].

```js
import { getPage } from 'next-page-tester';
import { screen, fireEvent } from '@testing-library/react';

describe('Blog page', () => {
  it('renders blog page', async () => {
    const { render } = await getPage({
      route: '/blog/1',
    });

    render();
    expect(screen.getByText('Blog')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Link'));
    await screen.findByText('Linked page');
  });
});
```

## What

The idea behind this library is to reproduce as closely as possible the way Next.js works without spinning up servers, and render the output in a local JSDOM environment.

In order to provide a valuable testing experience `next-page-tester` replicates the **rendering flow of an actual `next.js` application**:

1. **fetch data** for a given route
2. **render** the server-side rendered result to JSDOM as plain html (including `head` element)
3. **mount/hydrate** the client application to the previously rendered html

The mounted application is **interactive** and can be tested with any DOM testing library (like [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro)).

`next-page-tester` will take care of:

- loading and execute modules in the **expected browser or server environments**
- **resolving** provided **routes** into matching page component
- calling **Next.js data fetching methods** (`getServerSideProps`, `getInitialProps` or `getStaticProps`) if the case
- wrapping page with custom `_app` and `_document` components
- emulating **client side navigation** via `Link`, `router.push`, `router.replace`
- handling pages' `redirect` returns
- supporting [`next/router`][next-docs-router], [`next/head`][next-docs-head], [`next/link`][next-docs-link], [`next/config`][next-docs-runtime-config] and environment variables

## API

### getPage

`getPage` accepts an [option object](#options) and returns 4 values:

```js
import { getPage } from 'next-page-tester';

const { render, serverRender, serverRenderToString, page } = await getPage({
  options,
});
```

### render()

Type: `() => { nextRoot: HTMLElement<NextRoot> }`<br/>
Returns: `#__next` root element element.

Unless you have an advanced use-case, you should mostly use this method. Under the hood it calls `serverRender()` and then mounts/hydrates the React application into JSDOM `#__next` root element. This is what users would get/see when they visit a page.

### serverRender()

Type: `() => { nextRoot: HTMLElement<NextRoot> }`<br/>
Returns: `#__next` root element element.

Inject the output of server side rendering into the DOM but doesn't mount React. Use it to test how Next.js renders in the following scenarios:

- before Reacts mounts
- when JS is disabled
- SEO tests

### serverRenderToString()

Type: `() => { html: string }`

Render the output of server side rendering as HTML string. This is a pure method without side-effects.

### page

Type: `React.ReactElement<AppElement>`

React element of the application.

## Options

| Property                       | Description                                                                        | type                              | Default         |
| ------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------- | --------------- |
| **route** (mandatory)          | Next route (must start with `/`)                                                   | `string`                          | -               |
| **req**                        | Enhance default mocked [request object][req-docs]                                  | `req => req`                      | -               |
| **res**                        | Enhance default mocked [response object][res-docs]                                 | `res => res`                      | -               |
| **router**                     | Enhance default mocked [Next router object][next-docs-router]                      | `router => router`                | -               |
| **useApp**                     | Render [custom App component][next-docs-custom-app]                                | `boolean`                         | `true`          |
| **useDocument** (experimental) | Render [Document component][next-docs-custom-document]                             | `boolean`                         | `false`         |
| **nextRoot**                   | Absolute path to Next.js root folder                                               | `string`                          | _auto detected_ |
| **dotenvFile**                 | Relative path to a `.env` file holding [environment variables][next-docs-env-vars] | `string`                          | -               |
| **wrapper**                    | Map of render functions. Useful to decorate component tree with mocked providers.  | `{ Page?: NextPage => NextPage }` | -               |
| **nonIsolatedModules**         | List of modules that should preserve identity between client and server context.   | `string[]`                        | []              |

## Skipping Auto Cleanup & Helpers Initialisation

Since Next.js is not designed to run in a JSDOM environment we need to **setup the default JSDOM** to allow a smoother testing experience. By default, `next-page-tester` will:

- Provide `window.scrollTo` and `IntersectionObserver` mocks
- Cleanup DOM after each test
- Setup jest to preserve the identity of some specific modules between "server" and "client" execution

However, you may choose to skip the auto cleanup & helpers initialisation by setting the NPT_SKIP_AUTO_SETUP env variable to 'true'. You can do this with cross-env like so:

```js
cross-env NPT_SKIP_AUTO_SETUP=true jest
```

### Handling special imports

If your pages/components import **file types not natively handled by Node.js** (like style sheets, images, `.svg`, ...), you should configure your testing environment to properly process them. Eg, in case of Jest you might want configuring some [`moduleNameMapper`](https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring).

### Optional: patch Jest

Until **Jest v27** is published, you might need to patch `jest` in order to load modules with [proper server/client environments](#73). _Don't do this until you actually encounter issues_.

1. Install [`patch-package`](https://www.npmjs.com/package/patch-package) and follow its setup instructions
2. Manually update `node_modules/jest-runtime/build/index.js` file and replicate [this commit](https://github.com/facebook/jest/commit/e5a84d92fc906a5bb140f9753b644319cea095da#diff-c0d5b59e96fdc7ffc98405e8afb46d525505bc7b1c24916b5c8482de5a186c00)
3. Run `npx patch-package jest-runtime` or `yarn patch-package jest-runtime`

## Examples

Under [examples folder][examples-folder] we're documenting the testing cases which `next-page-tester` enables.

## Notes

- Data fetching methods' context `req` and `res` objects are mocked with [node-mocks-http][node-mocks-http]
- Next page tester is designed to be used with any testing framework/library but It's currently only tested with Jest and Testing Library. Feel free to open an issue if you had troubles with different setups
- It might be necessary to install `@types/react-dom` and `@types/webpack` when using Typescript in `strict` mode due to [this bug][next-gh-strict-bug]

### Experimental `useDocument` option

`useDocument` option is partially implemented and might be unstable.

### Next.js versions support

`next-page-tester` focuses on supporting only the last major version of Next.js:

| next-page-tester | next.js |
| ---------------- | ------- |
| v0.1.0 - v0.7.0  | v9.X.X  |
| v0.8.0 +         | v10.X.X |

## FAQ

### How do I mock API calls in my data fetching methods?

Because `next-page-tester` isolates modules between "client" and "server" context mocks that are created in test (client context) wont execute in data fetching methods (server context).
To overcome that, we need to "taint" such modules to preserve identity between "client" and "server" context by passing them through the `nonIsolatedModules` option.

```ts
test('as a user I want to mock a module in client & server environment', async () => {
  const stub = jest.spyOn(api, 'getData').mockReturnValue(Promise.resolve('data'))

  const { render } = await getPage({
    route: '/page',
    nextRoot,
    nonIsolatedModules: [`${process.cwd()}/src/path/to/my/module`],
  });

  expect(stub).toHaveBeenCalledTimes(1); // this was executed in your data fetching method
}
```

### How do I make cookies available in Next.js data fetching methods?

You can set cookies by appending them to `document.cookie` before calling `getPage`. `next-page-tester` will propagate cookies to `ctx.req.headers.cookie` so they will be available to data fetching methods. This also applies to subsequent fetching methods calls triggered by client side navigation.

```ts
test('authenticated page', async () => {
  document.cookie = 'SessionId=super=secret';
  document.cookie = 'SomeOtherCookie=SomeOtherValue';

  const { render } = await getPage({
    route: '/authenticated',
  });
  render();
});
```

Note: `document.cookie` does not get cleaned up automatically. You'll have to clear it manually after each test to keep everything in isolation.

### Error: Not implemented: window.scrollTo

Next.js `Link` component invokes `window.scrollTo` on click which is not implemented in JSDOM environment. In order to fix the error you should [set up your test environment](#set-up-your-test-environment) or provide [your own `window.scrollTo` mock](https://qiita.com/akameco/items/0edfdae02507204b24c8).

### Warning: Text content did not match. Server: "x" Client: "y" error

This warning means that your page renders differently between server and browser. This can be an expected behavior or signal a bug in your code.

## Todo's

- Consider reusing Next.js code parts (not only types)
- Consider supporting Next.js `trailingSlash` option
- Render custom `_error` page
- Provide a `debug` option to log execution info

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.andreacarraro.it"><img src="https://avatars3.githubusercontent.com/u/4573549?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrea Carraro</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/commits?author=toomuchdesign" title="Code">💻</a> <a href="#infra-toomuchdesign" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/toomuchdesign/next-page-tester/commits?author=toomuchdesign" title="Tests">⚠️</a> <a href="#maintenance-toomuchdesign" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://www.matej.snuderl.si/"><img src="https://avatars3.githubusercontent.com/u/8524109?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matej Šnuderl</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/commits?author=Meemaw" title="Code">💻</a> <a href="#infra-Meemaw" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/toomuchdesign/next-page-tester/commits?author=Meemaw" title="Tests">⚠️</a> <a href="https://github.com/toomuchdesign/next-page-tester/pulls?q=is%3Apr+reviewed-by%3AMeemaw" title="Reviewed Pull Requests">👀</a> <a href="#ideas-Meemaw" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/toomuchdesign/next-page-tester/commits?author=Meemaw" title="Documentation">📖</a></td>
    <td align="center"><a href="https://jason-williams.co.uk"><img src="https://avatars3.githubusercontent.com/u/936006?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jason Williams</b></sub></a><br /><a href="#ideas-jasonwilliams" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/arelaxend"><img src="https://avatars3.githubusercontent.com/u/8854658?v=4?s=100" width="100px;" alt=""/><br /><sub><b>arelaxend</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3Aarelaxend" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/kfazinic"><img src="https://avatars0.githubusercontent.com/u/8618138?v=4?s=100" width="100px;" alt=""/><br /><sub><b>kfazinic</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3Akfazinic" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/tomaszrondio"><img src="https://avatars0.githubusercontent.com/u/4939724?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tomasz Rondio</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3Atomaszrondio" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/alexandermendes"><img src="https://avatars1.githubusercontent.com/u/5636273?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alexander Mendes</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/commits?author=alexandermendes" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/jansepke"><img src="https://avatars0.githubusercontent.com/u/625043?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jan Sepke</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3Ajansepke" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/DavidOrchard"><img src="https://avatars2.githubusercontent.com/u/55760?v=4?s=100" width="100px;" alt=""/><br /><sub><b>DavidOrchard</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3ADavidOrchard" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/Doaa-Ismael"><img src="https://avatars.githubusercontent.com/u/24235866?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Doaa Ismael</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3ADoaa-Ismael" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/fracture91"><img src="https://avatars.githubusercontent.com/u/231859?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Hurle</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3Afracture91" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/massimeddu-sonic"><img src="https://avatars.githubusercontent.com/u/77116638?v=4?s=100" width="100px;" alt=""/><br /><sub><b>massimeddu-sonic</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3Amassimeddu-sonic" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://jes.st/about"><img src="https://avatars.githubusercontent.com/u/612020?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jess Telford</b></sub></a><br /><a href="https://github.com/toomuchdesign/next-page-tester/issues?q=author%3Ajesstelford" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START -->
 
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- prettier-ignore-end -->

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
[next-docs-link]: https://nextjs.org/docs/api-reference/next/link
[next-docs-runtime-config]: https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
[next-docs-head]: https://nextjs.org/docs/api-reference/next/head
[next-docs-custom-app]: https://nextjs.org/docs/advanced-features/custom-app
[next-docs-custom-document]: https://nextjs.org/docs/advanced-features/custom-document
[next-docs-env-vars]: https://nextjs.org/docs/basic-features/environment-variables
[next-gh-strict-bug]: https://github.com/vercel/next.js/issues/16219
[error-log-mock]: src/**tests**/use-document/use-document.test.tsx#L8
[examples-folder]: examples
