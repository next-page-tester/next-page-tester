import { getPage } from '../../../../src';
import { screen } from '@testing-library/react';

describe('Emotion', () => {
  it('renders nicely', async () => {
    const { render } = await getPage({
      route: '/page',
      useDocument: true,
      useApp: true,
      nextRoot: __dirname,
    });
    render();
    expect(screen.getByText('Emotion page')).toBeVisible();
  });
});
