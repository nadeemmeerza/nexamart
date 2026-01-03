// src/components/layout/ProtectedRoute.tsx

'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/app/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { auth } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/login');
    } else if (requiredRole && auth.user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [auth.isAuthenticated, auth.user?.role, requiredRole, router]);

  if (!auth.isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  if (requiredRole && auth.user?.role !== requiredRole) {
    return <div>You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
};