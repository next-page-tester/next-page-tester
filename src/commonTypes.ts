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
import DefaultError from './_error/DefaultError';
import DefaultApp from './_app/DefaultApp';

export type Req = ReturnType<typeof createRequest>;
export type Res = ReturnType<typeof createResponse>;

export type ReqEnhancer = (req: Req) => Req;
export type ResEnhancer = (res: Res) => Res;

export type Options = {
  route: string;
  nextRoot?: string;
  req?: ReqEnhancer;
  res?: ResEnhancer;
  router?: (router: NextRouter) => NextRouter;
  useApp?: boolean;
  useDocument?: boolean;
  nonIsolatedModules?: string[];
  dotenvFile?: string;
  wrapper?: {
    Page?: Enhancer<NextPage>;
  };
};

type NonRequiredOptions = 'dotenvFile' | 'wrapper';

export type OptionsWithDefaults = Omit<Required<Options>, NonRequiredOptions> &
  Pick<Options, NonRequiredOptions>;

// Options object is extended with some extra derived props
export type ExtendedOptions = OptionsWithDefaults & {
  pagesDirectory: string;
  pageExtensions: string[];
  previousRoute?: string;
  env: RuntimeEnvironment;
};

/*
 * Page
 */
export type PageFile<FileType> = {
  client: FileType;
  server: FileType;
};

export type PageParams = ParsedUrlQuery;

export type RouteInfo = {
  params: PageParams;
  query: PageParams;
  route: string;
  pagePath: string;
  paramsNumber: number;
  resolvedUrl: string;
};

export type PageObject = RouteInfo & {
  page: PageFile<NextPageFile>;
  appFile: PageFile<NextAppFile>;
};

export type PageProps = {
  [key: string]: unknown;
};

export type PageData<P extends PageProps = PageProps> = {
  props?: P;
  redirect?: Redirect;
  notFound?: true;
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

export type MakePageResult = {
  pageElement: JSX.Element;
  pageObject: PageObject;
};

export type PageInfo = {
  pageObject: PageObject;
  pageData: PageData;
};

export type PageComponents = {
  AppComponent: NextApp;
  PageComponent: NextPage;
};
