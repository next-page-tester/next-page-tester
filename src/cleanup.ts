import { cleanupDOM } from './makeRenderMethods';
import { cleanupEnvVars } from './setEnvVars';

export function cleanup() {
  cleanupDOM();
  cleanupEnvVars();
}
