import type { ExtendedOptions } from '../commonTypes';

// Modify respone status code to 404 before passing it into context to be available in "getInitialProps"
// https://github.com/vercel/next.js/blob/canary/packages/next/pages/_error.tsx#L22
export const notFoundResponseEnhancer = ({
  options,
}: {
  options: ExtendedOptions;
}) => {
  const responseEnhancer = options.res;
  const composed: ExtendedOptions['res'] = (res) => {
    const enhanced = responseEnhancer(res);
    enhanced.statusCode = 404;
    return enhanced;
  };
  return composed;
};
