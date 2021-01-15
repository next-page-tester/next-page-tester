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
function pagePathToRouteRegex(pagePath: string): RegExp {
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

export default pagePathToRouteRegex;
