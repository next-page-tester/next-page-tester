export function stringify(entity: unknown): string {
  return JSON.stringify(entity, null, ' ');
}
