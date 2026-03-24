import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Toaster position="top-right" />
      <main className="container mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}

export default MyApp;