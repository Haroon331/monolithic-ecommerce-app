'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const Layout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check authentication if not on login page
    if (pathname !== '/seller/login') {
      const isAuthenticated = localStorage.getItem('sellerAuthenticated') === 'true';
      if (!isAuthenticated) {
        router.push('/seller/login');
      }
    }
  }, [pathname, router]);

  // Don't render layout on login page
  if (pathname === '/seller/login') {
    return <>{children}</>;
  }

  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default Layout