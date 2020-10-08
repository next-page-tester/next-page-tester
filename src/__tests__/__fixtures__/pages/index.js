import React from 'react';
import { stringify } from '../../../utils';

export default function index(props) {
  return <>`/index - props: ${stringify(props)}`</>;
}
