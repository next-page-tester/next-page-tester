import type { GetServerSideProps } from 'next';

export default function PageA() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  throw new Error('Something went wrong!');
};
