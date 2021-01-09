## Testing Next.js for SEO

Since `next-page-tester` simulates the server side rendering cycle of a Next.js app, It's possible writing test assertions against the initial DOM generated from SSR before React gets mounted/hydrated.

```js
import { getPage } from 'next-page-tester';

describe('SEO tests', () => {
  it('renders page wrapped in custom _app wrapped in _document', async () => {
    const { serverRender } = await getPage({
      route: '/my-page',
      useDocument: true,
    });
    serverRender();

    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');

    const head = document.head;
    expect(head.querySelector('meta[name="Description"]')).toHaveAttribute(
      'Content',
      'My custom page description'
    );
  });
});
```
