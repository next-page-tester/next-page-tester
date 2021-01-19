import React from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';
import { useRouter } from 'next/router';

type Props = {
  href: string;
  hrefObject: UrlObject;
};

export const PageA = ({ href, hrefObject }: Props) => {
  const { replace } = useRouter();

  const goToPageBstring = () => {
    replace(href);
  };

  const goToPageBObject = () => {
    replace(hrefObject);
  };

  return (
    <div>
      <h2>This is page A</h2>

      <Link href={href}>
        <a>Go to B with Link (with string)</a>
      </Link>
      <Link href={hrefObject}>
        <a>Go to B with Link (with object)</a>
      </Link>

      <a onClick={goToPageBstring}>Go to B programmatically (with string)</a>
      <a onClick={goToPageBObject}>Go to B programmatically (with object)</a>
    </div>
  );
};
