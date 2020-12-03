import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type Props = {
  referer: string;
};

type FormValues = {
  email: string;
};

export default function Home({ referer }: Props) {
  const { register, handleSubmit } = useForm<FormValues>();
  const [values, setValues] = useState<FormValues>();

  const onSubmit = handleSubmit((values) => {
    setValues(values);
  });

  return (
    <div>
      <Head>
        <title>Page A</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>Came from {referer}</div>

      <Link href="/">
        <a>Back to root</a>
      </Link>

      <form onSubmit={onSubmit} noValidate>
        <input ref={register} type="email" name="email" placeholder="Email" />
        <button type="submit">Submit form</button>
      </form>

      {values && <span>Got values: {JSON.stringify(values)}</span>}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  return {
    props: {
      referer: context.req.headers.referer || '',
    },
  };
};
