## Next page tester & SingletonRouter (next/router)

Next.JS exports `SingletonRouter` from `next/router` which can be used from anywhere in your application. Since default exports are hard to mock universally, some work is needed from your side for everything to work correctly. Here is an example using `jest` but simillar approach could be taken in any test runner.

```js
import { getPage } from 'next-page-tester';
import SingletonRouter from 'next/router';

jest.mock('next/router', () => {
  return {
    __esModule: true,
    ...jest.requireActual<Record<string, unknown>>('next/router'),
    default: {},
  };
});

describe('use SingletonRouter', () => {
  test('as a user I can user "SingletonRouter" exported from "next/router" and "next-page-tester"', async () => {
    const { page } = await getPage({
      nextRoot: __dirname,
      route: '/a',
      router: (router) => Object.assign(SingletonRouter, router),
    });

    await screen.findByText('Post 1');
  });
});
```
