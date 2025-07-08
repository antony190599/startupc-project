"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log("session", session);

  useEffect(() => {
    // Verificar si la sesión está cargando
    if (status === "loading") return;

    // Si hay roles especificados, verificar que el usuario tenga el rol permitido
    if (allowedRoles && session?.user?.role && !allowedRoles.includes(session.user.role)) {
      router.push('/dashboard');
    }
  }, [status, session, router, allowedRoles]);

  // Mostrar un loader mientras se verifica la autenticación
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si está autenticado y tiene el rol correcto, mostrar el contenido
  if (status === "authenticated" && 
      (!allowedRoles || allowedRoles.includes(session.user.role))) {
    return <>{children}</>;
  }

  // No mostrar nada mientras se redirige
  return null;
}