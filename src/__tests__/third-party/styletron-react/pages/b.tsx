import React from 'react';
import { styled } from 'styletron-react';

const Panel = styled('div', () => {
  return { backgroundColor: 'orange' };
});

export default function PageB() {
  return <Panel>This is page B</Panel>;
}
