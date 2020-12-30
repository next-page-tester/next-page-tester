import { getPage } from '../../../index';
import { render, screen } from '@testing-library/react';

describe('baseweb', () => {
  it('should work on server', async () => {
    const { page } = await getPage({
      nextRoot: __dirname,
      useDocument: true,
      useApp: true,
      route: '/a',
    });
    const { container } = render(page);

    expect(screen.getByText('style object')).toHaveStyle({ color: '#174291' });
    expect(screen.getByText('Custom _app element')).toBeInTheDocument();

    expect(container.querySelector('style')).toHaveAttribute(
      'class',
      '_styletron_hydrate_'
    );
  });
});
