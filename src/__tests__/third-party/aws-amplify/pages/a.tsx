import React from 'react';
import type { GetServerSideProps } from 'next';
import { withSSRContext } from 'aws-amplify';

type Props = {
  message: string;
};

export default function WithAwsAmplify(props: Props) {
  return <div>{props.message}</div>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  try {
    const { Auth } = withSSRContext(context);
    const user = await Auth.currentAuthenticatedUser();
    return { props: { message: user.username } };
  } catch (error) {
    return { props: { message: error } };
  }
};
