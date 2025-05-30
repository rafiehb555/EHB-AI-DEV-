import React from 'react';
import { WorkspaceProvider } from '../context/WorkspaceContext';

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <WorkspaceProvider>
      {getLayout(<Component {...pageProps} />)}
    </WorkspaceProvider>
  );
}

export default MyApp;