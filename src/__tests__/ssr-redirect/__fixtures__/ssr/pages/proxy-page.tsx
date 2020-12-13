import type { GetServerSideProps } from 'next';

export default function ProxyPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { destination } = context.query;

  return {
    redirect: {
      destination: Array.isArray(destination)
        ? String(destination[0])
        : String(destination),
      permanent: true,
    },
  };
};
