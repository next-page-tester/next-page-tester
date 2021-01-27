import { screen } from '@testing-library/react';
import { getPage } from '../../../src';
import { cleanupDOM } from '../../makeRenderMethods';

describe('cleanup-dom', () => {
  test('unmounts components & teardowns global document objects', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => true);

    const initialDocument = document.documentElement.innerHTML;
    const initialBody = document.body.innerHTML;
    const initialHead = document.head.innerHTML;
    const initialTitle = document.title;

    const { render } = await getPage({
      route: '/a',
      nextRoot: __dirname + '/__fixtures__',
    });

    render();
    expect(screen.getByText('A')).toBeInTheDocument();

    cleanupDOM();

    expect(spy).toHaveBeenCalledWith('Unmounted');

    expect(document.documentElement.innerHTML).toEqual(initialDocument);
    expect(document.body.innerHTML).toEqual(initialBody);
    expect(document.head.innerHTML).toEqual(initialHead);
    expect(document.title).toEqual(initialTitle);
  });
});
