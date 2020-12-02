import type {
  GetServerSideProps,
  GetStaticProps,
  GetStaticPaths,
  NextPage,
} from 'next';
import { AppContext, AppInitialProps } from 'next/app';
import type { NextRouter } from 'next/router';
import type { createRequest, createResponse } from 'node-mocks-http';
import type { ParsedUrlQuery } from 'querystring';
import type { DocumentType } from 'next/dist/next-server/lib/utils';

type Req = ReturnType<typeof createRequest>;
type Res = ReturnType<typeof createResponse>;

export type Options = {
  route: string;
  nextRoot?: string;
  req?: (req: Req) => Req;
  res?: (res: Res) => Res;
  router?: (router: NextRouter) => NextRouter;
  useApp?: boolean;
  useDocument?: boolean;
};

export type OptionsWithDefaults = Required<Options>;

// Options object is extended with some extra derived props
export type ExtendedOptions = OptionsWithDefaults & {
  pagesDirectory: string;
  pageExtensions: string[];
};

export type NextPageFile = {
  [name: string]: any;
  default: NextPage;
  getServerSideProps?: GetServerSideProps;
  getStaticProps?: GetStaticProps;
  getStaticPaths?: GetStaticPaths;
};

// @NOTE we might use: import type App from 'next/app';
// but I had troubles with setting up its generics
export type NextApp = React.FunctionComponent<{
  Component: NextPage;
  pageProps?: { [key: string]: any };
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

export type PageData = {
  props?: {
    [key: string]: any;
  };
};

export class CustomError extends Error {
  payload?: any;
}
