const DYNAMIC_ROUTE_SEGMENT_REGEX = /\[([^\.\/\[\]]*)\]/g;
const DYNAMIC_PATH_SEGMENT_REGEX_STRING = '[^/?]*';

const CATCH_ALL_ROUTE_SEGMENT_REGEX = /\[\.{3}([^\/\[\]]*)\]/;
const CATCH_ALL_PATH_SEGMENT_REGEX_STRING = '.*?';

const OPTIONAL_CATCH_ALL_ROUTE_SEGMENT_REGEX = /\/?\[\[\.{3}([^\/\[\]]*)\]\]/;
const OPTIONAL_CATCH_ALL_PATH_SEGMENT_REGEX_STRING = '.*?';

const TRAILING_INDEX_REGEX = /\/index$/;
const OPTIONAL_TRAILING_INDEX_REGEX_STRING = '(?:/index)?';

const FILE_EXTENSION_REGEX = /\.[a-zA-Z0-9]*$/;

function makeNamedCaptureGroup({ name, regex }) {
  return `(?<${name}>${regex})`;
}

function makeOptionalNamedCapturingGroup({ name, regex }) {
  const captureGroup = makeNamedCaptureGroup({ name, regex });
  return `${captureGroup}?`;
}

// Build a regex from a page path to catch its matching routes
function pagePathToRouteRegex(pagePath) {
  const regex = pagePath
    .replace(FILE_EXTENSION_REGEX, '')
    .replace(TRAILING_INDEX_REGEX, OPTIONAL_TRAILING_INDEX_REGEX_STRING)
    .replace(OPTIONAL_CATCH_ALL_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      const captureGroup = makeOptionalNamedCapturingGroup({
        name: paramName,
        regex: OPTIONAL_CATCH_ALL_PATH_SEGMENT_REGEX_STRING,
      });
      return `(?:\/)?${captureGroup}`;
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
