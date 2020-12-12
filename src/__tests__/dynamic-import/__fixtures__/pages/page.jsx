import React from 'react';
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/hello'));

export default function DynamicImportPage() {
  return (
    <div>
      <p>Dynamic import</p>
      <DynamicComponent />
    </div>
  );
}
