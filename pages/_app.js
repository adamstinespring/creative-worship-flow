import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ToastProvider>
    </AuthProvider>
  );
}
