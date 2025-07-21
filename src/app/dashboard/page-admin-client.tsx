import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { useState, useEffect } from "react";

export default function AdminDashboardClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    thisMonth: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch('/api/applications/stats');
        const statsData = await statsRes.json();
        
        const applicationsRes = await fetch('/api/applications/recent');
        const applicationsData = await applicationsRes.json();

        if (statsData.success) {
          setStats(statsData.data);
        }
        
        if (applicationsData.success) {
          setRecentApplications(applicationsData.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
          </div>
          <Skeleton className="h-[300px] mt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona aplicaciones y usuarios del sistema</p>
      </div>

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
              Aplicaciones aprobadas
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
              Aplicaciones rechazadas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aplicaciones Recientes</CardTitle>
          <CardDescription>
            Últimas aplicaciones recibidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.map((application: any) => (
                <div key={application.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{application.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {application.entrepreneur}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/applications/${application.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay aplicaciones recientes</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-medium text-blue-800">Información del Administrador</h2>
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Nombre:</span> {session?.user?.firstname} {session?.user?.lastname}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Email:</span> {session?.user?.email}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Rol:</span> {session?.user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
