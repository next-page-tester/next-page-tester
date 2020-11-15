# Changelog

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
