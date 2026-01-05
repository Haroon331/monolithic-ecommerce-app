'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check authentication if not on login page
    if (pathname !== '/admin/login') {
      const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
      if (!isAuthenticated) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
};

export default AdminLayout;

