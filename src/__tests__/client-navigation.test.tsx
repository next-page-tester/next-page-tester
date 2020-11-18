import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPage } from '../index';
const nextRoot = __dirname + '/__fixtures__';

describe('Client side navigation', () => {
  describe.only('using Link component', () => {
    it('navigates between pages', async () => {
      const Page = await getPage({
        nextRoot,
        route: '/client-navigation-link/a',
      });

      render(Page);

      // Navigate A -> B
      screen.getByText('This is page A');
      const linkToB = screen.getByText('Go to page B');
      fireEvent.click(linkToB);

      // Navigate B -> A
      await screen.findByText('This is page B');
      const linkToA = await screen.findByText('Go to page A');
      fireEvent.click(linkToA);
      await screen.findByText('This is page A');
    });
  });
});
