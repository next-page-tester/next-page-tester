const DYNAMIC_ROUTE_SEGMENT_REGEX = /\[([^\.\/\[\]]*)\]/g;
const DYNAMIC_PATH_SEGMENT_REGEX_STRING = '[^/?]*';

const CATCH_ALL_ROUTE_SEGMENT_REGEX = /\[\.{3}([^\/\[\]]*)\]/;
const CATCH_ALL_PATH_SEGMENT_REGEX_STRING = '.*?';

const TRAILING_INDEX_REGEX = /\/index$/;
const OPTIONAL_TRAILING_INDEX_REGEX_STRING = '(?:/index)?';

const FILE_EXTENSION_REGEX = /\.[a-zA-Z0-9]*$/;

function makeNamedCapturingGroup({ name, regex }) {
  return `(?<${name}>${regex})`;
}

// Build a regex from a page path to catch its matching routes
function pagePathToRouteRegex(pagePath) {
  const regex = pagePath
    .replace(FILE_EXTENSION_REGEX, '')
    .replace(TRAILING_INDEX_REGEX, OPTIONAL_TRAILING_INDEX_REGEX_STRING)
    .replace(CATCH_ALL_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      return makeNamedCapturingGroup({
        name: paramName,
        regex: CATCH_ALL_PATH_SEGMENT_REGEX_STRING,
      });
    })
    .replace(DYNAMIC_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      return makeNamedCapturingGroup({
        name: paramName,
        regex: DYNAMIC_PATH_SEGMENT_REGEX_STRING,
      });
    });

  // Add route's trailing slash
  return new RegExp(`^${regex}$`);
}

export default pagePathToRouteRegex;
