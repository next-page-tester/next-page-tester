import type {
  GetServerSideProps,
  GetStaticProps,
  GetStaticPaths,
  NextPage,
} from 'next';
import { AppContext, AppInitialProps } from 'next/app';
import type { NextRouter } from 'next/router';
import type { createResponse, createRequest } from 'node-mocks-http';
import type { ParsedUrlQuery } from 'querystring';
import type { DocumentType } from 'next/dist/next-server/lib/utils';

export type Req = ReturnType<typeof createRequest>;
type Res = ReturnType<typeof createResponse>;

export type ReqEnhancer = (req: Req) => Req;
type ResEnhancer = (res: Res) => Res;

export type Options = {
  route: string;
  nextRoot?: string;
  req?: ReqEnhancer;
  res?: ResEnhancer;
  router?: (router: NextRouter) => NextRouter;
  useApp?: boolean;
  useDocument?: boolean;
};

export type OptionsWithDefaults = Required<Options>;

// Options object is extended with some extra derived props
export type ExtendedOptions = OptionsWithDefaults & {
  pagesDirectory: string;
  pageExtensions: string[];
  previousRoute?: string;
};

/*
 * Page
 */
export type PageParams = ParsedUrlQuery;

export type PageObject = {
  page: NextPageFile;
  route: string;
  pagePath: string;
  params: PageParams;
  paramsNumber: number;
  query: PageParams;
  resolvedUrl: string;
};

export type PageProps = {
  [key: string]: any;
};

export type PageData = {
  props?: PageProps;
};

export type NextPageFile = {
  [name: string]: any;
  default: NextPage;
  getServerSideProps?: GetServerSideProps;
  getStaticProps?: GetStaticProps;
  getStaticPaths?: GetStaticPaths;
};

/*
 * App
 */

// @NOTE we might use: import type App from 'next/app';
// but I had troubles with setting up its generics
export type NextApp = React.FunctionComponent<{
  Component: NextPage;
  pageProps?: PageProps;
}> & {
  getInitialProps?: (appContext: AppContext) => Promise<AppInitialProps>;
};

export type NextCustomAppFile = {
  [name: string]: any;
  default: NextApp;
};

export type NextCustomDocumentFile = {
  default: DocumentType;
};

export class CustomError extends Error {
  payload?: any;
}
