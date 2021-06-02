import { getPage } from '../../../../src';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

describe.skip('styletron-react', () => {
  it('As a user I can test applications using "styletron-react"', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { render } = await getPage({
      nextRoot: __dirname,
      route: '/a',
      useDocument: true,
    });

    render();

    const redColorClassName = 'ae';
    const orangeBackgroundColorClassName = 'af';

    // Warnings beacuse JSDOM doesn't fully implement Stylesheet API
    expect(warnSpy).toHaveBeenCalledWith(
      `Failed to inject CSS: ".${redColorClassName}{color:red}". Perhaps this has invalid or un-prefixed properties?`
    );

    const linkToB = screen.getByText('Go to page B');
    expect(linkToB).toHaveClass(redColorClassName);

    userEvent.click(linkToB);

    expect(await screen.findByText('This is page B')).toHaveClass(
      orangeBackgroundColorClassName
    );
    expect(screen.getByText('Go to page A')).toHaveClass(redColorClassName);

    expect(warnSpy).toHaveBeenCalledWith(
      `Failed to inject CSS: ".${orangeBackgroundColorClassName}{background-color:orange}". Perhaps this has invalid or un-prefixed properties?`
    );

    expect(warnSpy).toHaveBeenCalledTimes(2);
  });
});
