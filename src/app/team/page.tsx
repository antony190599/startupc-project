'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, GraduationCap, Mail, Phone, Linkedin } from 'lucide-react';
import { universities } from '@/lib/enum';

interface ProjectApplicationSummary {
  id: string;
  projectName: string | null;
  programType: string | null;
  category: string | null;
  industry: string | null;
  stage: string | null;
  projectStatus: string | null;
  isCompleted: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  dni: string | null;
  studentCode: string | null;
  career: string | null;
  cycle: string | null;
  phone: string | null;
  universityEmail: string | null;
  contactEmail: string;
  linkedin: string | null;
  university: string | null;
  otherUniversity: string | null;
  projectApplication: ProjectApplicationSummary;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMembersResponse {
  teamMembers: TeamMember[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function TeamPage() {
  const { data: session, status } = useSession();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt' as 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'contactEmail',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const fetchTeamMembers = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/team-members?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch team members');
      }

      const data: TeamMembersResponse = await response.json();
      setTeamMembers(data.teamMembers);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchTeamMembers();
    }
  }, [session, status, pagination.page, pagination.pageSize, filters]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setFilters(prev => ({ 
      ...prev, 
      sortBy: field as any, 
      sortOrder: order 
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on sort
  };

  const getUniversityDisplay = (university: string | null) => {
    if (!university) return 'No especificada';
    return universities[university as keyof typeof universities] || university;
  };

  const getProjectStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-muted-foreground">
          Debes iniciar sesión para ver tu equipo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Mis Equipos</h1>
        <p className="text-muted-foreground">
          Gestiona a los miembros de tu equipo y sus roles en los proyectos.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar miembros..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split('-') as [string, 'asc' | 'desc'];
              handleSortChange(field, order);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstName-asc">Nombre A-Z</SelectItem>
              <SelectItem value="firstName-desc">Nombre Z-A</SelectItem>
              <SelectItem value="lastName-asc">Apellido A-Z</SelectItem>
              <SelectItem value="lastName-desc">Apellido Z-A</SelectItem>
              <SelectItem value="createdAt-desc">Más recientes</SelectItem>
              <SelectItem value="createdAt-asc">Más antiguos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {pagination.total} miembro{pagination.total !== 1 ? 's' : ''} en total
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Team Members Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: pagination.pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="mt-8 p-8 text-center border rounded-lg border-dashed">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Tu equipo está vacío</h2>
          <p className="text-muted-foreground">
            {filters.search 
              ? 'No se encontraron miembros que coincidan con tu búsqueda.'
              : 'Añade miembros a tu equipo para colaborar en proyectos.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {member.firstName} {member.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <GraduationCap className="h-4 w-4" />
                        {getUniversityDisplay(member.university)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {member.career || 'Sin carrera'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{member.contactEmail}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.linkedin && (
                      <div className="flex items-center gap-2 text-sm">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Academic Information */}
                  {(member.studentCode || member.cycle) && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">Información Académica</div>
                      <div className="space-y-1 text-sm">
                        {member.studentCode && (
                          <div>Código: {member.studentCode}</div>
                        )}
                        {member.cycle && (
                          <div>Ciclo: {member.cycle}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Information */}
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Proyecto</div>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">
                        {member.projectApplication.projectName || '-'}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {member.projectApplication.programType || 'Sin tipo'}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getProjectStatusColor(member.projectApplication.projectStatus)}`}
                        >
                          {member.projectApplication.projectStatus || 'Sin estado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
                {pagination.total} miembros
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
