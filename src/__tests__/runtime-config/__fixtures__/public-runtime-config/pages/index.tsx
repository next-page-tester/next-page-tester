import React from 'react';
import getConfig from 'next/config';

export default function WithPublicRuntimeConfig() {
  const config = getConfig();

  return (
    <script
      data-testid="runtime-config"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          serverRuntimeConfig: config.serverRuntimeConfig,
          publicRuntimeConfig: config.publicRuntimeConfig,
        }),
      }}
    />
  );
}
