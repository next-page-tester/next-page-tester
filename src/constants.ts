export const APP_PATH = '/_app' as const;
export const DOCUMENT_PATH = '/_document' as const;
export const ERROR_PATH = '/_error' as const;
export const FOUR_O_FOUR_PATH = '/404' as const;

export const NEXT_ROOT_ELEMENT_ID = '__next' as const;

export enum RuntimeEnvironment {
  SERVER = 'server',
  CLIENT = 'client',
}

export const ABSOLUTE_URL_REGEXP = new RegExp('^(?:[a-z]+:)?//', 'i');
