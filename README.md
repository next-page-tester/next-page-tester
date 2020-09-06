# Next pages tester

Test Next.js in Node environment.

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
