export const APP_PATH = '/_app' as const;
export const DOCUMENT_PATH = '/_document' as const;

export const NEXT_ROOT_ELEMENT_ID = '__next' as const;

export enum RuntimeEnvironment {
  SERVER = 'server',
  CLIENT = 'client',
}
