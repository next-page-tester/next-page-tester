import React, { useEffect } from 'react';

export default function CleanupPageA() {
  useEffect(() => {
    return () => {
      console.warn('Unmounted');
    };
  });

  return <div>A</div>;
}
