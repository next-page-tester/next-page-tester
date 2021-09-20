import type { PageParams } from '../../commonTypes';

export enum ROUTE_PARAMS_TYPES {
  DYNAMIC = 'dynamic',
  CATCH_ALL = 'catch_all',
  OPTIONAL_CATCH_ALL = 'optional_catch_all',
}

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

function encodeCaptureGroupName(string: string): string {
  return '__encoded' + Buffer.from(string).toString('hex');
}

function decodeCaptureGroupName(string: string): string {
  if (string.startsWith('__encoded')) {
    return Buffer.from(string.replace(/^__encoded/, ''), 'hex').toString();
  }
  return string;
}

/**
 * Build a regex from a page path to catch its matching routes
 * @returns a regex and the map of the types of params found
 */
export function pagePathToRouteRegex(
  pagePath: string
): {
  regex: RegExp;
  paramTypes: Record<string, ROUTE_PARAMS_TYPES>;
} {
  // Store found route param names by type
  const paramTypes: Record<string, ROUTE_PARAMS_TYPES> = {};

  // Special case for /index page which should match both "/" and "/index" pathnames
  if (pagePath === '/index') {
    return {
      regex: /^\/(?:index)?$/,
      paramTypes,
    };
  }

  const regex = pagePath
    .replace(TRAILING_INDEX_REGEX, OPTIONAL_TRAILING_INDEX_REGEX_STRING)
    .replace(OPTIONAL_CATCH_ALL_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      paramTypes[paramName] = ROUTE_PARAMS_TYPES.OPTIONAL_CATCH_ALL;
      const captureGroup = makeOptionalNamedCapturingGroup({
        name: paramName,
        regex: OPTIONAL_CATCH_ALL_PATH_SEGMENT_REGEX_STRING,
      });
      return `(?:/)?${captureGroup}`;
    })
    .replace(CATCH_ALL_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      paramTypes[paramName] = ROUTE_PARAMS_TYPES.CATCH_ALL;
      return makeNamedCaptureGroup({
        name: paramName,
        regex: CATCH_ALL_PATH_SEGMENT_REGEX_STRING,
      });
    })
    .replace(DYNAMIC_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      paramTypes[paramName] = ROUTE_PARAMS_TYPES.DYNAMIC;
      return makeNamedCaptureGroup({
        name: paramName,
        regex: DYNAMIC_PATH_SEGMENT_REGEX_STRING,
      });
    });

  // Add route's trailing slash
  return {
    regex: new RegExp(`^${regex}$`),
    paramTypes,
  };
}

export function makeParamsObject({
  routeRegexCaptureGroups,
  paramTypes,
}: {
  routeRegexCaptureGroups?: Record<string, string>;
  paramTypes: Record<string, ROUTE_PARAMS_TYPES>;
}) {
  const params = {} as PageParams;

  if (routeRegexCaptureGroups) {
    for (const [key, value] of Object.entries(routeRegexCaptureGroups)) {
      if (value !== undefined) {
        const paramType = paramTypes[key];
        if (
          paramType === ROUTE_PARAMS_TYPES.CATCH_ALL ||
          paramType === ROUTE_PARAMS_TYPES.OPTIONAL_CATCH_ALL
        ) {
          params[key] = value.split('/');
        } else {
          params[key] = value;
        }
      }
    }
  }
  return params;
}
