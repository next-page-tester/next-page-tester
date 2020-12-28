import * as React from 'react';
import { Button } from 'baseui/button';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';

export default function WithBaseweb() {
  const [css, theme] = useStyletron();

  return (
    <div>
      <Button onClick={() => console.log('hey')}>Hello</Button>
      <p style={{ color: theme.colors.accent600 }}>style object</p>
      <Block $style={{ color: theme.colors.accent600 }}>$style object</Block>
    </div>
  );
}
