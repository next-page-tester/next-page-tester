# A note about client and server renders

Since Next.js is a framework which renders pages on the server and hydrate them on the client, `next-page-tester` faced quickly with the need of replicating this double rendering process.

## Next.js rendering cycle

Next.js (and any other React server framework) renders pages twice:

- first on the server in a Node.js environment
- then on a client in a browser environment

This 2 rendering processes happens on 2 different machines, in different environments and different execution context and produce slightly different results. More precisely here are a few points worth mentioning:

- **Import registry:** server and client renders 2 different instances of the same rendered page (sounds obvious: they have 2 different import registries since they are 2 different machines)
- **Environment variables:** server and client render with 2 different global `process.env` object
- **Execution environment:** Server (Node.js) and client (browser) environments provide different global API's

In order to reproduce a rendering result as close as possible to the actual one, `next-page-tester` renders twice too, on the same machine where tests are executed:

- **Client render** uses the natural environment of the local execution context
- **Server render** is simulated by temporarily mutating local execution context to fake a Next.js server environment

Let's see how the challenges mentioned above are currently tackled in `next-page-tester`.

### Import registry

Since `next-page-tester` renders twice on the same machine while Next.js does it on 2 different machines, this means that Next.js renders 2 different instances of the same component tree.

This is an important detail since often libraries store variables at module level which value depends on the execution environment at module initialization time.

In order to do so, `next-page-tester` imports all the modules needed make a server-rendering cycle in a **single go** and using a **new/fresh module registry** (with [Jests's isolateModules](https://jestjs.io/docs/jest-object#jestisolatemodulesfn) or [stealthy-require](https://github.com/analog-nico/stealthy-require)) different from the one used by the local machine.

### Environment variables

Since Next.js supports server and client side only env var configuration, the global `process.env` object is manipulated to replicate the values expected in both contexts.

### Execution environment

On server rendering some browser-only globals like `window`, `document` and `navigator` are temporarily removed.

This allows to properly run code that detects server environment with `typeof document === 'undefined'`.
