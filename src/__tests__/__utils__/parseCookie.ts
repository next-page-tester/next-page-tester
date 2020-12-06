import cookieUtil from 'cookie';
export function parseCookie(cookie?: string): { [key: string]: string } {
  if (typeof cookie !== 'string') {
    return {};
  }
  return cookieUtil.parse(cookie);
}
