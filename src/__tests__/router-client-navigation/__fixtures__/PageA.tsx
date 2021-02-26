import React from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';
import Router, { useRouter } from 'next/router';

type Props = {
  href: string;
  hrefObject: UrlObject;
};

export const PageA = ({ href, hrefObject }: Props) => {
  const { replace } = useRouter();

  return (
    <div>
      <h2>This is page A</h2>

      <Link href={href}>
        <a>Go to B with Link (with string)</a>
      </Link>
      <Link href={hrefObject}>
        <a>Go to B with Link (with object)</a>
      </Link>

      <a onClick={() => Router.replace(href)}>
        Go to B programmatically (SingletonRouter - with string)
      </a>
      <a onClick={() => Router.replace(hrefObject)}>
        Go to B programmatically (SingletonRouter - with object)
      </a>

      <a onClick={() => replace(href)}>
        Go to B programmatically (useRouter - with string)
      </a>
      <a onClick={() => replace(hrefObject)}>
        Go to B programmatically (useRouter - with object)
      </a>
    </div>
  );
};
