## Next page tester & Enzyme

Even though discouraged, it's possible rendering and testing next.js root element (`#__next`) with [enzyme](https://github.com/enzymejs/enzyme).

```js
import { getPage } from 'next-page-tester';
import { mount } from 'enzyme';

describe('use enzyme', () => {
  test('as a user I can combine "enzyme" and "next-page-tester"', async () => {
    const { page } = await getPage({
      nextRoot: __dirname,
      route: '/a',
    });

    const wrapper = mount(page);
  });
});
```
