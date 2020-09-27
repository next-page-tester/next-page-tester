import type {
  GetServerSideProps,
  GetStaticProps,
  GetStaticPaths,
  NextPage,
} from 'next';
import type { NextRouter } from 'next/router';
import type { createRequest, createResponse } from 'node-mocks-http';
type Req = ReturnType<typeof createRequest>;
type Res = ReturnType<typeof createResponse>;

export type Options = {
  route: string;
  pagesDirectory: string;
  req?: (req: Req) => Req;
  res?: (res: Res) => Res;
  router?: (router: NextRouter) => NextRouter;
};

export type NextPageFile = {
  [name: string]: any;
  default: NextPage;
  getServerSideProps?: GetServerSideProps;
  getStaticProps?: GetStaticProps;
  getStaticPaths?: GetStaticPaths;
};

export type PageParams = { [name: string]: string | string[] };

export type PageObject = {
  page: NextPageFile;
  route: string;
  pagePath: string;
  params: PageParams;
  paramsNumber: number;
};
