import type { GetServerSideProps } from 'next';

export default function ProxyToPageA() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/page-a',
      permanent: true,
    },
  };
};
