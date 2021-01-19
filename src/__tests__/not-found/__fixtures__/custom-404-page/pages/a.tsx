import { GetServerSideProps } from 'next';

export default function A() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    notFound: true,
  };
};
