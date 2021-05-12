import React from 'react';
import { MockedProvider } from '../../MockedProvider';

export default function PageA() {
  return (
    <MockedProvider.Consumer>
      {({ source }) => <p>Source: {source}</p>}
    </MockedProvider.Consumer>
  );
}
