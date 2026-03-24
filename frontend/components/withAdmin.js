import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAdmin(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || user.role !== 'ADMIN')) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'ADMIN') {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return <Component {...props} />;
  };
}