"use client"

import { useRoleCheck } from "@/hooks/useRoleCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EntrepreneurDashboardPage() {
  const { isAuthorized, isLoading } = useRoleCheck("entrepreneur");
  const { data: session } = useSession();

  if (isLoading) {
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
      <h1 className="text-3xl font-bold mb-2">Mi Panel de Emprendedor</h1>
      <p className="text-gray-600 mb-8">Gestiona tus proyectos y aplicaciones</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mi Proyecto</CardTitle>
            <CardDescription>Estado actual de tu aplicación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Eco Startup</h3>
                <p className="text-sm text-gray-600">Programa: Inqubalab</p>
                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    En revisión
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm">Progreso del formulario: 75%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" asChild>
                  <Link href="/onboarding">Continuar formulario</Link>
                </Button>
                <Button size="sm" variant="outline">Ver detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos eventos</CardTitle>
            <CardDescription>Eventos y talleres disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-blue-600">15 de Julio, 2023</p>
                <h3 className="font-medium">Taller de Pitch</h3>
                <p className="text-sm text-gray-600 mt-1">Aprende a presentar tu proyecto de manera efectiva</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-blue-600">22 de Julio, 2023</p>
                <h3 className="font-medium">Asesoría de modelo de negocio</h3>
                <p className="text-sm text-gray-600 mt-1">Sesiones uno a uno con mentores especializados</p>
              </div>
              
              <Button size="sm" variant="outline" className="w-full">Ver todos los eventos</Button>
            </div>
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
