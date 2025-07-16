"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Download
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardClient() {
  const { data: session } = useSession();

  // Mock data - in a real app, this would come from API calls
  const stats = {
    totalApplications: 156,
    pendingReview: 23,
    approved: 89,
    rejected: 44,
    thisMonth: 12
  };

  const recentApplications = [
    {
      id: "APP001",
      name: "Eco Startup",
      entrepreneur: "María García",
      status: "pending",
      date: "2024-01-15"
    },
    {
      id: "APP002", 
      name: "Tech Innovation",
      entrepreneur: "Carlos López",
      status: "approved",
      date: "2024-01-14"
    },
    {
      id: "APP003",
      name: "Social Impact",
      entrepreneur: "Ana Rodríguez",
      status: "rejected",
      date: "2024-01-13"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona aplicaciones y usuarios del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aplicaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.thisMonth} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes de Revisión</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.approved / stats.totalApplications) * 100)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.rejected / stats.totalApplications) * 100)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Aplicaciones Recientes
          </CardTitle>
          <CardDescription>
            Últimas aplicaciones recibidas que requieren revisión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{application.name}</h3>
                    {getStatusBadge(application.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Emprendedor: {application.entrepreneur}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ID: {application.id} • Fecha: {new Date(application.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/applications">
                  Ver todas las aplicaciones
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Gestión del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/applications">
                <FileText className="h-4 w-4 mr-2" />
                Revisar Aplicaciones
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/users">
                <Users className="h-4 w-4 mr-2" />
                Gestionar Usuarios
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/reports">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generar Reportes
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Estado actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Estado del servidor:</span>
              <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Base de datos:</span>
              <Badge variant="default" className="bg-green-100 text-green-800">Conectada</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Última actualización:</span>
              <span className="text-sm text-gray-600">Hace 5 minutos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Information */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-medium text-blue-800">Información del Administrador</h2>
        <div className="mt-2">
          <p><span className="font-semibold">Usuario:</span> {session?.user?.firstname} {session?.user?.lastname}</p>
          <p><span className="font-semibold">Email:</span> {session?.user?.email}</p>
          <p><span className="font-semibold">Rol:</span> {session?.user?.role}</p>
        </div>
      </div>
    </div>
  );
}
