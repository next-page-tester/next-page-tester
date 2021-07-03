import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const importTime_window = typeof window !== 'undefined';
const importTime_document = typeof document !== 'undefined';
const importTime_navigator = typeof navigator !== 'undefined';

class CustomDocument extends Document {
  static getInitialProps = async (ctx) => {
    const initialProps = await Document.getInitialProps(ctx);

    const gip_runTime_window = typeof window !== 'undefined';
    const gip_runTime_document = typeof document !== 'undefined';
    const gip_runTime_navigator = typeof navigator !== 'undefined';

    return {
      ...initialProps,
      gip_runTime_window,
      gip_runTime_document,
      gip_runTime_navigator,
    };
  };

  render() {
    const {
      gip_runTime_window,
      gip_runTime_document,
      gip_runTime_navigator,
    } = this.props;
    const component_runTime_window = typeof window !== 'undefined';
    const component_runTime_document = typeof document !== 'undefined';
    const component_runTime_navigator = typeof navigator !== 'undefined';

    return (
      <Html lang="en">
        <Head>
          <meta
            name="global-object"
            content={JSON.stringify({
              importTime_window,
              importTime_document,
              importTime_navigator,
              gip_runTime_window,
              gip_runTime_document,
              gip_runTime_navigator,
              component_runTime_window,
              component_runTime_document,
              component_runTime_navigator,
            })}
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
