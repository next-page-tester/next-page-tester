import type { GetServerSideProps } from 'next';

export default function PageA() {
  return null;
}

PageA.getInitialProps = function () {
  throw new Error('Something went wrong!');
};
