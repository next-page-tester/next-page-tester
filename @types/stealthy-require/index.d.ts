declare module 'stealthy-require' {
  export default function stealthyRequire<Result>(
    requireCache: typeof require.cache,
    callback: () => Result
  ): Result;
}
