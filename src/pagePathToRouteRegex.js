const PARAM_WILDCARD_REGEX = /[^\/]*/;
// prettier-ignore
export const PARAM_WILDCARD_REGEX_STRING = PARAM_WILDCARD_REGEX.toString().slice(1, -1);
const DYNAMIC_ROUTE_SEGMENT_REGEX = /\[([^\/\[\]]*)\]/g;
const FILE_EXTENSION_REGEX = /\..*$/;

function makeNamedCapturingGroup({ name, regex }) {
  return `(?<${name}>${regex})`;
}

// Build a regex from a page path to catch its matching routes
function pagePathToRouteRegex(pagePath) {
  const regex = pagePath
    .replace(FILE_EXTENSION_REGEX, '')
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
