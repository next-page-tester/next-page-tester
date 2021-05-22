import type {
  GetServerSideProps,
  GetStaticProps,
  GetStaticPaths,
  NextPage,
  Redirect,
} from 'next';
import type { NextRouter } from 'next/router';
import type { createResponse, createRequest } from 'node-mocks-http';
import type { ParsedUrlQuery } from 'querystring';
import type { DocumentType, Enhancer } from 'next/dist/next-server/lib/utils';
import { RuntimeEnvironment } from './constants';
import DefaultError from 'next/error';
import DefaultApp from './_app/DefaultApp';

export type Req = ReturnType<typeof createRequest>;
export type Res = ReturnType<typeof createResponse>;

export type ReqEnhancer = (req: Req) => Req;
export type ResEnhancer = (res: Res) => Res;

export type Options = {
  route: string;
  sharedModules?: string[];
  nextRoot?: string;
  req?: ReqEnhancer;
  res?: ResEnhancer;
  router?: (router: NextRouter) => NextRouter;
  useApp?: boolean;
  useDocument?: boolean;
  dotenvFile?: string;
  wrapper?: {
    App?: Enhancer<NextApp>;
    Page?: Enhancer<NextPage>;
  };
};

type OptionsWithoutDefaultValue = 'dotenvFile' | 'wrapper';

export type OptionsWithDefaults = Omit<
  Required<Options>,
  OptionsWithoutDefaultValue
> &
  Pick<Options, OptionsWithoutDefaultValue>;

// Options object is extended with some extra derived props
export type ExtendedOptions = OptionsWithDefaults & {
  pagesDirectory: string;
  pageExtensions: string[];
  previousRoute?: string;
  env: RuntimeEnvironment;
};

/*
 * Pages
 */
export type PageParams = ParsedUrlQuery;

export type RouteInfo = {
  params: PageParams;
  query: PageParams;
  route: string;
  // Page file path without extension
  pagePath: string;
  resolvedUrl: string;
  detectedLocale: string | undefined;
  urlObject: URL;
};

export type FoundPageObject = RouteInfo & {
  type: 'found';
  absolutePagePath: string;
  files: MultiEnv<NextExistingPageFiles>;
};

export type NotFoundPageObject = RouteInfo & {
  type: 'notFound';
  absolutePagePath: string;
  files: MultiEnv<NextErrorPageFiles>;
};

export type PageObject = FoundPageObject | NotFoundPageObject;

export type PageProps = {
  [key: string]: unknown;
};

export type PageData<P extends PageProps = PageProps> = {
  props?: P;
  redirect?: Redirect;
  notFound?: true;
};

export type PageInfo = {
  pageObject: PageObject;
  pageData: PageData;
};

export type NextPageFile = {
  [name: string]: unknown;
  default: NextPage;
  getServerSideProps?: GetServerSideProps;
  getStaticProps?: GetStaticProps;
  getStaticPaths?: GetStaticPaths;
};

// @NOTE we might use: import type App from 'next/app';
// but I had troubles with setting up its generics
export type NextApp = typeof DefaultApp;

export type NextAppFile = {
  [name: string]: unknown;
  default: NextApp;
};

export type NextErrorFile = {
  default: typeof DefaultError;
};

export type NextDocumentFile = {
  default: DocumentType;
};

export class CustomError extends Error {
  payload?: unknown;
}

export type NextFile = NextErrorFile | NextPageFile;

// Next files: this are the files necessary to render a Next page
export type NextPageFiles<PageFile extends NextFile> = {
  documentFile: NextDocumentFile;
  appFile: NextAppFile;
  pageFile: PageFile;
};

export type NextExistingPageFiles = NextPageFiles<NextPageFile>;

export type NextErrorPageFiles = NextPageFiles<NextErrorFile>;

export type MultiEnv<FileType> = {
  client: FileType;
  server: FileType;
};

// Extras
export type MakePageResult = {
  pageElement: JSX.Element;
  pageObject: PageObject;
};
