import React from 'react';

export default function CustomError(props) {
  return (
    <>
      <h1>Custom error page</h1>
      <p>{props.statusCode}</p>
    </>
  );
}

CustomError.getInitialProps = (context) => {
  return {
    statusCode: context.res.statusCode,
  };
};
