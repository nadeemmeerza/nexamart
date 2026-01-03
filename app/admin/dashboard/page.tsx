// src/app/(routes)/admin/dashboard/page.tsx
'use client';

import React from 'react';
import { AdminDashboard } from '@/app/components/admin/Dashboard/AdminDashboard';
// import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';


export default  function AdminDashboardPage() {
  // const { user, isLoading } = useAuth();
 
  const router = useRouter();
  
  // Redirect if not admin
  // if (!isLoading && user?.role !== 'admin') { 
  // router.push('/');
  //   return null;
  // }

  if (false) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <AdminDashboard />;
}