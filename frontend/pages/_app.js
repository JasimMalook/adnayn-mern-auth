import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { getStoredAuth } from '../utils/auth';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(getStoredAuth());
  }, []);

  return (
    <Layout auth={auth} setAuth={setAuth}>
      <Component {...pageProps} auth={auth} setAuth={setAuth} />
    </Layout>
  );
}

export default MyApp;
