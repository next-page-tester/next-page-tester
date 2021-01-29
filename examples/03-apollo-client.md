## Next page tester & @apollo/client

You can use [MockedProvider](https://www.apollographql.com/docs/react/development-testing/testing/#the-mockedprovider-component) to test pages using [@apollo/client](https://github.com/apollographql/apollo-client/blob/main/docs/source/index.mdx).

```js
import { getPage } from 'next-page-tester';
import { MockedProvider } from '@apollo/client/testing';
import { screen } from '@testing-library/react';

describe('use @apollo/client', () => {
  test('as a user I can combine "@apollo/client" and "next-page-tester"', async () => {
    const { render } = await getPage({
      nextRoot: __dirname,
      route: '/',
      nonIsolatedModules: ['@apollo/client'],
      wrapper: {
        Page: (Page) => (pageProps) => {
          return (
            <MockedProvider mocks={mocks}>
              <Page {...pageProps} />
            </MockedProvider>
          );
        },
      },
    });
    render();

    await screen.findByText('Post 1');
  });
});
```
