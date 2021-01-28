import React from 'react';
import { MockedProvider } from '../../MockedProvider';

export default function PageA() {
  return (
    <MockedProvider.Consumer>
      {({ source }) => <span>Source: {source}</span>}
    </MockedProvider.Consumer>
  );
}
