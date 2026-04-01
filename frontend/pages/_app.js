import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';
  const hideFooter = isAuthPage;

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          {!isAdminPage && <Navbar />}
          <Toaster position="top-right" />
          <main className={`flex-grow ${!isAdminPage ? 'container mx-auto px-4 py-8' : ''}`}>
            <Component {...pageProps} />
          </main>
          {!isAdminPage && !hideFooter && <Footer />}
          {!isAdminPage && !isAuthPage && <ChatbotWidget />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
