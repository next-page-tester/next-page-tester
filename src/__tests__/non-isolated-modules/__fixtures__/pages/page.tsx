import React, { useState } from 'react';
import * as api from '../api';
import type { GetServerSideProps } from 'next';

type Props = {
  data: string;
};

export default function Page({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);

  const handleClick = () => {
    api.getData().then(setData);
  };

  return (
    <>
      <span>{data}</span>
      <button onClick={handleClick}>Change data</button>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      data: await api.getData(),
    },
  };
};
