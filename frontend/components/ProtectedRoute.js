import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = ({ auth, children, requireAdmin = false }) => {
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push('/login');
    } else if (requireAdmin && auth.user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [auth, router, requireAdmin]);

  if (!auth?.user) return null;
  if (requireAdmin && auth.user.role !== 'ADMIN') return null;

  return children;
};

export default ProtectedRoute;
