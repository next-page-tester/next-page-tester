import EnvVarsDataFetchingPage from '../EnvVarsDataFetchingPage';
export default EnvVarsDataFetchingPage;

export function getStaticProps() {
  return {
    props: {
      FROM_DOTFILE_DATA_FETCHING: process.env.FROM_DOTFILE_DATA_FETCHING,
      NEXT_PUBLIC_FROM_DOTFILE_DATA_FETCHING:
        process.env.NEXT_PUBLIC_FROM_DOTFILE_DATA_FETCHING,
    },
  };
}
