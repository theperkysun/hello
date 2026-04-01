import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem('fz_token');
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  return children;
}
