# Patching Jest v26

If you are using Jest v26, you might need to it in order to load modules with [proper server/client environments](#73). _Don't do this until you actually encounter issues_.

1. Install [`patch-package`](https://github.com/ds300/patch-package#set-up) and follow its setup instructions
2. If using the last version of `jest` (`26.6.3`), copy [this `patches` folder ](../patches) to your project root and run `npx patch-package` or `yarn patch-package`.
3. If using `jest < v26.6.3` update manually `node_modules/jest-runtime/build/index.js` file replicating [this commit](https://github.com/facebook/jest/commit/e5a84d92fc906a5bb140f9753b644319cea095da#diff-c0d5b59e96fdc7ffc98405e8afb46d525505bc7b1c24916b5c8482de5a186c00) and run `npx patch-package jest-runtime` or `yarn patch-package jest-runtime`

If using **Yarn v2** you might try the approach described [here](https://github.com/toomuchdesign/next-page-tester/issues/219).
