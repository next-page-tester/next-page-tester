# Changelog

## 0.15.0

### New Features

- Add req.cookies property in "getServerSideProps"

## 0.14.0

### New Features

- Require and execute \_document, \_app and pages (including data fetching methods) in expected client or server environment

### Bugfixes

- Ensure only pages with allowed extensions are required
- Prevent custom app from executing data fetching when `useApp` is `false`

## 0.13.0

### Bugfixes

- Ensure router object and rendered page are updated simultaneously

## 0.12.0

### New Features

- Support `next/head`
- Provide `initTestHelpers` to help setting up test environment

### Bugfixes

- Fix client navigation when `useDocument` enabled

## 0.11.0

### New Features

- Handle data fetching `redirect` returns

## 0.10.1

### Bugfixes

- Fix user events not firing when using default `_document`

## 0.10.0

### New Features

- Make `document.cookie` available to fetching methods as `ctx.req.headers.cookie`
- Make `referer` available to fetching methods as `ctx.req.headers.referer`

### Bugfixes

- Don't pass `getInitialProps` context `req`/`res` objects when execution happens as a result of client-side navigation
- Simplistically simulate non-browser environment when executing server-only methods/modules

## 0.9.0

### Breaking Changes

- Renamed `useCustomApp` option to `useApp`

### New Features

- `useDocument` experimental option: add `_document` rendering support

## 0.8.1

### Bugfixes

- Make paths handling OS insensitive

## 0.8.0

### Breaking Changes

- Dropped support for Next.js 9
- `getPage` promise returns an object with a `page` prop holding the expected page element (previously page element was directly returned)
- `useCustomApp` option defaults to `true`

### New Features

- Provide support for Next.js 10

## 0.7.1

### Bugfixes

- Fix default routing behaviour with trailing slash (#24)

## 0.7.0

### New Features

- Support client-side navigation via `Link`, `router.push`, `router.replace`

## 0.6.0

### Breaking Changes

- `getPage` trows when page's fetching methods return an object with missing `props` field (eg. `redirect` and `notFound` responses). The response object is accessible in `error.payload`.

## 0.5.0

### Breaking Changes

- Remove `pagesDirectory` and `pageExtensions` options
- Rename `customApp` option -> `useCustomApp`

### New Features

- Auto detect pages directory
- Auto detect `pageExtensions` option
- Add `nextRoot` option

## 0.4.0

### Breaking Changes

- Support custom App's data fetching with `getInitialProps`
- Throw error when no matching page is found

### New Features

- Support custom file extensions via `pageExtensions` option
- Migrate tests to TS

## 0.3.0

### Breaking Changes

- Support pages' `getInitialProps` data fetching method

### New Features

- Support custom App component behind `customApp` option flag (no support for App's `getInitialProps`, yet)

## 0.2.0

### Breaking Changes

- Expose Typescript types

### New Features

- Migrate codebase to Typescript
- Replace query-string with node's querystring

## 0.1.0

Initial release
