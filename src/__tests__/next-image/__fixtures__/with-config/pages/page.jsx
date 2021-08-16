import React from 'react';
import Image from 'next/image';
import localImage from '../../150.png';

export default function NextImagePage() {
  return (
    <div>
      <Image
        src={localImage}
        title="Local image"
        alt="Local image"
        layout="fill"
      />
      <Image
        src="https://via.placeholder.com/150"
        title="Remote image"
        alt="Remote image"
        layout="fill"
      />
    </div>
  );
}
