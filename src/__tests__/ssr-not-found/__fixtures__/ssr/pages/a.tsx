import type { GetServerSideProps } from 'next';

export default function PageA() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    notFound: true,
  };
};
