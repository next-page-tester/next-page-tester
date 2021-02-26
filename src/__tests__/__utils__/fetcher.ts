export const fetcher = (resource: string) =>
  fetch(resource).catch(() => resource);
