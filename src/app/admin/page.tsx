"use client"

import { useRoleCheck } from "@/hooks/useRoleCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton, Alert, AlertDescription, AlertTitle } from "@/components/ui";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";

export default function AdminPage() {
  const { isAuthorized, isLoading } = useRoleCheck("admin");
  const { data: session } = useSession();

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-6 w-[300px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso denegado</AlertTitle>
          <AlertDescription>
            No tienes permisos para acceder a esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
      <p className="text-gray-600 mb-8">Gestiona usuarios, aplicaciones y configuración del sistema</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Gestión de usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total usuarios: 24</p>
            <p>Administradores: 3</p>
            <p>Emprendedores: 21</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos</CardTitle>
            <CardDescription>Gestión de proyectos y aplicaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total proyectos: 15</p>
            <p>En revisión: 5</p>
            <p>Aprobados: 8</p>
            <p>Rechazados: 2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Información y métricas del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Nuevos registros (7d): 12</p>
            <p>Formularios completados: 9</p>
            <p>Tasa de conversión: 75%</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-medium text-blue-800">Información del usuario</h2>
        <div className="mt-2">
          <p><span className="font-semibold">Usuario:</span> {session?.user?.firstname} {session?.user?.lastname}</p>
          <p><span className="font-semibold">Email:</span> {session?.user?.email}</p>
          <p><span className="font-semibold">Rol:</span> {session?.user?.role}</p>
        </div>
      </div>
    </div>
  );
}
