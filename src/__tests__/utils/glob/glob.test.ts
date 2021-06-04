/**
 * @jest-environment node
 */
import path from 'path';
import { existsSync } from 'fs';
import { glob } from '../../../utils';

describe('glob util', () => {
  it('finds expected filed', async () => {
    const pagesDirectory = path.join(__dirname, '__fixtures__');
    const files = await glob(path.join(pagesDirectory, '**', '*'));

    files.forEach((file) => {
      expect(existsSync(file)).toBe(true);
    });
  });
});
