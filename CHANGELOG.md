# Changelog

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
