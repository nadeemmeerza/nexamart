// src/components/layout/ProtectedRoute.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/app/types/auth.types';
import { useSession } from 'next-auth/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {

  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (requiredRole && session?.user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [status, session?.user?.role, requiredRole, router]);

  if (status === 'unauthenticated') {
    return <div>Redirecting to login...</div>;
  }

  if (requiredRole && session?.user?.role !== requiredRole) {
    return <div>You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
};