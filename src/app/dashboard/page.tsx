"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import EntrepreneurDashboardClient from './page-entrepreneur-client';
import AdminDashboardClient from './page-admin-client';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-6 w-[300px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso denegado</AlertTitle>
          <AlertDescription>
            Debes iniciar sesión para acceder al dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render dashboard based on user role
  const userRole = session.user.role;

  if (userRole === 'admin') {
    return <AdminDashboardClient />;
  }

  if (userRole === 'entrepreneur') {
    return <EntrepreneurDashboardClient />;
  }

  // Unknown role
  return (
    <div className="container mx-auto py-10 px-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Rol no válido</AlertTitle>
        <AlertDescription>
          Tu rol de usuario ({userRole}) no tiene acceso al dashboard.
        </AlertDescription>
      </Alert>
    </div>
  );
}