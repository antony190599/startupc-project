'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, UserIcon, BuildingIcon, ClockIcon } from 'lucide-react';
import ApplicationSteps from './application-steps';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface ApplicationDetailClientProps {
  id: string;
}

export default function ApplicationDetailClient({ id }: ApplicationDetailClientProps) {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('application');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/applications/${id}`);
        const result = await res.json();
        if (result.success) {
          setApplication(result.data);
        } else {
          setApplication(null);
        }
      } catch (e) {
        setApplication(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Helper function to get program type badge variant
  const getProgramTypeVariant = (programType: string) => {
    switch (programType) {
      case 'inqubalab':
        return 'default';
      case 'idea-feedback':
        return 'secondary';
      case 'aceleracion':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Helper function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }
  if (!application) {
    return <div className="text-center text-muted-foreground py-12">Aplicación no encontrada.</div>;
  }

  // Get primary user info - can be either team member or user
  const displayUser = application.primaryUser;

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {'Detalle de Aplicación'}
          </h1>
          <p className="text-muted-foreground">
            ID de Aplicación: {application.id}
          </p>
        </div>
        
      </div>

      {/* Summary Card - 3 column grid, only real fields */}
      <Card>
        <CardContent className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            {/* Column 1 */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Nombre del Proyecto</div>
                <div className="font-bold text-base">{application.projectName || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tipo de Programa</div>
                <div className="font-semibold">{application.programType || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Fecha de Creación</div>
                <div className="font-bold">{application.createdAt ? formatDate(application.createdAt) : '-'}</div>
              </div>
            </div>
            {/* Column 2 */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Estado</div>
                <Badge variant={getStatusVariant(application.projectStatus || 'pending')} className="text-xs px-3 py-1">
                  {application.projectStatus === 'completed' ? 'Completado' : 
                   application.projectStatus === 'in_progress' ? 'En Progreso' : 
                   application.projectStatus === 'pending' ? 'Pendiente' : 'Pendiente'}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Miembros del Equipo</div>
                <div className="font-semibold">{application.teamMembers?.length ?? 0}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Completado</div>
                <div className="font-semibold">{application.completedAt ? formatDate(application.completedAt) : '-'}</div>
              </div>
            </div>
            {/* Column 3 */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Usuario Principal</div>
                <div className="font-semibold">
                  {displayUser ? (
                    `${displayUser.firstname} ${displayUser.lastname}`
                  ) : '-'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {displayUser?.contactEmail || displayUser?.email || '-'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Categoría</div>
                <div className="font-semibold">{application.category || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Industria</div>
                <div className="font-semibold">{application.industry || '-'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Card>
        <CardContent className="py-5">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="application">Pasos de la Aplicación</TabsTrigger>
            </TabsList>
            <TabsContent value="application" className="space-y-4">
              <ApplicationSteps application={application} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 