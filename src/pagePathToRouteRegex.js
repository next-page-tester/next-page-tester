// prettier-ignore
export const PARAM_WILDCARD_REGEX_STRING = '[^/?]*';
const DYNAMIC_ROUTE_SEGMENT_REGEX = /\[([^\/\[\]]*)\]/g;
const FILE_EXTENSION_REGEX = /\..*$/;
const TRAILING_INDEX_REGEX = /\/index$/;
export const OPTIONAL_TRAILING_INDEX_REGEX_STRING = '(?:/index)?';

function makeNamedCapturingGroup({ name, regex }) {
  return `(?<${name}>${regex})`;
}

// Build a regex from a page path to catch its matching routes
function pagePathToRouteRegex(pagePath) {
  const regex = pagePath
    .replace(FILE_EXTENSION_REGEX, '')
    .replace(TRAILING_INDEX_REGEX, OPTIONAL_TRAILING_INDEX_REGEX_STRING)
    .replace(DYNAMIC_ROUTE_SEGMENT_REGEX, (match, paramName) => {
      return makeNamedCapturingGroup({
        name: paramName,
        regex: PARAM_WILDCARD_REGEX_STRING,
      });
    });

  // Add route's trailing slash
  return new RegExp(`^${regex}$`);
}

export default pagePathToRouteRegex;
