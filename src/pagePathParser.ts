// [param]
const DYNAMIC_ROUTE_SEGMENT_REGEX = /\[([^./[\]]*)\]/g;
const DYNAMIC_PATH_SEGMENT_REGEX_STRING = '[^/?]*';

// [...slug]
const CATCH_ALL_ROUTE_SEGMENT_REGEX = /\[\.{3}([^/[\]]*)\]/;
const CATCH_ALL_PATH_SEGMENT_REGEX_STRING = '.*?';

// [[...slug]]
const OPTIONAL_CATCH_ALL_ROUTE_SEGMENT_REGEX = /\/?\[\[\.{3}([^/[\]]*)\]\]/;
const OPTIONAL_CATCH_ALL_PATH_SEGMENT_REGEX_STRING = '.*?';

const TRAILING_INDEX_REGEX = /\/index$/;
const OPTIONAL_TRAILING_INDEX_REGEX_STRING = '(?:/index)?';

type namedCapture = {
  name: string;
  regex: string;
};

function makeNamedCaptureGroup({ name, regex }: namedCapture) {
  return `(?<${name}>${regex})`;
}

function makeOptionalNamedCapturingGroup({ name, regex }: namedCapture) {
  const captureGroup = makeNamedCaptureGroup({ name, regex });
  return `${captureGroup}?`;
}

// Build a regex from a page path to catch its matching routes
export function pagePathToRouteRegex(pagePath: string): RegExp {
  // Special case for /index page which should match both "/" and "/index" pathnames
  if (pagePath === '/index') {
    return /^\/(?:index)?$/;
  }

  const regex = pagePath
    .replace(TRAILING_INDEX_REGEX, OPTIONAL_TRAILING_INDEX_REGEX_STRING)
    .replace(OPTIONAL_CATCH_ALL_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      const captureGroup = makeOptionalNamedCapturingGroup({
        name: paramName,
        regex: OPTIONAL_CATCH_ALL_PATH_SEGMENT_REGEX_STRING,
      });
      return `(?:/)?${captureGroup}`;
    })
    .replace(CATCH_ALL_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      return makeNamedCaptureGroup({
        name: paramName,
        regex: CATCH_ALL_PATH_SEGMENT_REGEX_STRING,
      });
    })
    .replace(DYNAMIC_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      return makeNamedCaptureGroup({
        name: paramName,
        regex: DYNAMIC_PATH_SEGMENT_REGEX_STRING,
      });
    });

  // Add route's trailing slash
  return new RegExp(`^${regex}$`);
}

export enum ROUTE_PARAMS_TYPES {
  DYNAMIC = 'dynamic',
  CATCH_ALL = 'catch_all',
  OPTIONAL_CATCH_ALL = 'optional_catch_all',
}

// Create an object listing the param types of a given Next.js page path.
export function extractPagePathParamsType({
  pagePath,
}: {
  pagePath: string;
}): {
  Record<string, ROUTE_PARAMS_TYPES>
} {
  const routeParams: {
    [pathSegment: string]: ROUTE_PARAMS_TYPES;
  } = {};

  const optionalCatchAllParams = [
    pagePath.match(OPTIONAL_CATCH_ALL_ROUTE_SEGMENT_REGEX),
  ];
  pagePath = pagePath.replace(OPTIONAL_CATCH_ALL_ROUTE_SEGMENT_REGEX, '');

  const catchAllParams = [pagePath.match(CATCH_ALL_ROUTE_SEGMENT_REGEX)];
  pagePath = pagePath.replace(CATCH_ALL_ROUTE_SEGMENT_REGEX, '');

  const dynamicParams = [...pagePath.matchAll(DYNAMIC_ROUTE_SEGMENT_REGEX)];

  [
    {
      matches: optionalCatchAllParams,
      type: ROUTE_PARAMS_TYPES.OPTIONAL_CATCH_ALL,
    },
    {
      matches: catchAllParams,
      type: ROUTE_PARAMS_TYPES.CATCH_ALL,
    },
    {
      matches: dynamicParams,
      type: ROUTE_PARAMS_TYPES.DYNAMIC,
    },
  ].forEach(({ matches, type }) => {
    for (const match of matches) {
      if (match) {
        const paramName = match[1];
        routeParams[paramName] = type;
      }
    }
  });

  return routeParams;
}
