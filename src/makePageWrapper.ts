import React, { useState, useEffect } from 'react';
export type RenderPageHandler = ({
  route,
}: {
  route: string;
}) => Promise<JSX.Element>;

const INITIAL_ROUTE = 'initial';

function PageWrapper({
  renderPage,
  children,
}: {
  renderPage: RenderPageHandler;
  children: JSX.Element;
}) {
  const [route, setRoute] = useState(INITIAL_ROUTE);
  const [pageElement, setPageElement] = useState(children);
  useEffect(() => {
    if (route === INITIAL_ROUTE) {
      return;
    }
    renderPage({ route }).then(setPageElement);
  }, [route]);
  return pageElement;
}

export default function makePageWrapper({
  pageElement,
  renderPage,
}: {
  pageElement: JSX.Element;
  renderPage: RenderPageHandler;
}) {
  return React.createElement(PageWrapper, {
    renderPage,
    children: pageElement,
  });
}
