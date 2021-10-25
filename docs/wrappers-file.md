# Wrappers file

If your application needs some custom configuration to set up/mock any context provider, you can do so by wrapping app or page component with a custom decorator.

App and page wrappers have to be declared in a separate file and exposed respectively as `App` and `Page` named exports. The absolute path of the file should be then provided as `wrappers` option when invoking `getPage`.

This is a wrappers file template to start your own:

```ts
import type { AppWrapper, PageWrapper } from 'next-page-tester';

export const App: AppWrapper = (App) => (appProps) => <App {...appProps} />;
export const Page: PageWrapper = (Page) => (pageProps) => (
  <Page {...pageProps} />
);
```
