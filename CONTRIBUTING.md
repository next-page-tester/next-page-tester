## Releasing

Before releasing a new version, please follow these points:

- Update [`Next.js versions support` chart](https://github.com/next-page-tester/next-page-tester#nextjs-versions-support) if Next.js version support was changed
- Update [`Contributors` chart](<[Contributors](https://github.com/next-page-tester/next-page-tester#contributors-)>) with [All contributors bot](https://allcontributors.org/docs/en/bot/usage)
- Update `CHANGELOG.md` with relevant information

## Publishing

Publishing is currently performed locally by maintainers. Run the following commands to bump package.json version and release to npm.

- `npm run version [patch|minor|major]`
- `npm publish`
