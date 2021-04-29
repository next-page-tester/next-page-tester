## Full-page snapshot tests

It is possible to write full-page snapshot tests to exclude regressions while working on UI features. Note that usage of prettier isn't necessary and serves only to get readable snapshots.

You can set `useDocument` to `true` to ensure `<head>` content didn't change.

```js
import { getPage } from 'next-page-tester';
import prettier from 'prettier';

describe('Snapshot tests', () => {
  it('page renders and matches snapshot', async () => {
    const { serverRenderToString, render } = await getPage({
      route: '/my-page',
      useDocument: true,
    });

    // check correctness of SSR result
    const { html } = serverRenderToString();
    const formattedSSRSnapshot = prettier.format(html, {
      parser: 'html',
    });

    expect(formattedSSRSnapshot).toMatchSnapshot();

    // check hydrated app
    const { nextRoot } = render();
    const formattedHydratedSnapshot = prettier.format(nextRoot.outerHTML, {
      parser: 'html',
    });

    expect(formattedHydratedSnapshot).toMatchSnapshot();
  });
});
```
