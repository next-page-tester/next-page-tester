import React from 'react';
import getNextConfig from 'next/config';

export default function WithRuntimeConfig() {
  return (
    <script
      data-testid="runtime-config"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getNextConfig()),
      }}
    />
  );
}
