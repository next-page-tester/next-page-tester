import React from 'react';
import type { GetServerSideProps } from 'next';
import getConfig from 'next/config';

type Props = {
  serverRuntimeConfig: object;
  publicRuntimeConfig: object;
};

export default function WithServerRuntimeConfig(props: Props) {
  return (
    <script
      data-testid="runtime-config"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(props),
      }}
    />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const config = getConfig();

  return {
    props: getConfig(),
  };
};
