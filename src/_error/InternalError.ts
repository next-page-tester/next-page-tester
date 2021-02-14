export class InternalError extends Error {
  constructor(message: string) {
    super(`[next-page-tester] ${message}`);
  }
}
