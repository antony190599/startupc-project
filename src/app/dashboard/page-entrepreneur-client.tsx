"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, PlayCircle, ChevronDown, ChevronRight, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingStatus, getCurrentOnboardingStep } from "@/lib/utils/functions/onboarding";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OnboardingStatus {
  hasApplication: boolean;
  currentStep: string | null;
  completedSteps: string[];
  progress: number;
  isComplete: boolean;
  applicationId?: string;
  programId?: string;
  createdAt?: string;
  updatedAt?: string;
  program?: {
    name: string | null;
    description: string | null;
    type: string | null;
    cohortCode: string | null;
    startDate: string | null;
    endDate: string | null;
    year: string | null;
  }
}

type StatusGroup = 'active' | 'completed' | 'rejected' | 'not-applied';

interface GroupedApplications {
  active: OnboardingStatus[];
  completed: OnboardingStatus[];
  rejected: OnboardingStatus[];
  notApplied: OnboardingStatus[];
}

export default function EntrepreneurDashboardClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [onboardingStatuses, setOnboardingStatuses] = useState<OnboardingStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<StatusGroup>>(new Set(['active', 'not-applied', 'completed']));

  useEffect(() => {
    let isMounted = true;
    
    const loadOnboardingStatuses = async () => {
      if (!session?.user) return;
      try {
        console.log("Loading onboarding statuses");
        const statuses = await getOnboardingStatus();
        
        // Check if component is still mounted before proceeding
        if (!isMounted) return;
        
        // For each status, get the current step
        const statusesWithCurrentStep = await Promise.all(
          statuses.map(async (status: OnboardingStatus) => {
            const currentStep = await getCurrentOnboardingStep(status.programId as string);
            return {
              ...status,
              currentStep: currentStep.currentStep,
            };
          })
        );
        
        // Check again before setting state
        if (isMounted) {
          setOnboardingStatuses(statusesWithCurrentStep);
        }
      } catch (error) {
        console.error('Error loading onboarding statuses:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    if (session?.user) {
      loadOnboardingStatuses();
    }

    return () => {
      isMounted = false;
    }
  }, [session]);

  const getStepName = (step: string) => {
    const stepNames: { [key: string]: string } = {
      'program-selection': 'Selección',
      'general-data': 'Datos',
      'impact-origin': 'Impacto',
      'presentation': 'Presentación',
      'team': 'Equipo',
      'preferences': 'Preferencias',
      'consent': 'Consentimiento',
    };
    return stepNames[step] || step;
  };

  const groupApplications = (): GroupedApplications => {
    const grouped: GroupedApplications = {
      active: [],
      completed: [],
      rejected: [],
      notApplied: []
    };

    onboardingStatuses.forEach(status => {
      if (!status.hasApplication) {
        grouped.notApplied.push(status);
      } else if (status.isComplete) {
        grouped.completed.push(status);
      } else if (status.progress > 0) {
        grouped.active.push(status);
      } else {
        grouped.active.push(status);
      }
    });

    // Sort active by most recent update
    grouped.active.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return grouped;
  };

  const toggleGroup = (group: StatusGroup) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const getStatusIcon = (status: OnboardingStatus) => {
    if (status.isComplete) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status.progress > 0) return <PlayCircle className="h-4 w-4 text-blue-600" />;
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = (status: OnboardingStatus) => {
    if (status.isComplete) return 'Completado';
    if (status.progress > 0) return 'En progreso';
    return 'Pendiente';
  };

  const getStatusColor = (status: OnboardingStatus) => {
    if (status.isComplete) return 'bg-green-100 text-green-800';
    if (status.progress > 0) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const grouped = groupApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis postulaciones</h1>
        <p className="text-gray-600 text-sm">Gestiona tus proyectos y aplicaciones</p>
      </div>

      {onboardingStatuses.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No tienes aplicaciones</CardTitle>
            <CardDescription>Comienza postulando a un programa.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Not Applied Applications */}
      {grouped.notApplied.length > 0 && (
        <Collapsible open={expandedGroups.has('not-applied')} onOpenChange={() => toggleGroup('not-applied')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="font-semibold">Disponibles ({grouped.notApplied.length})</span>
              </div>
              {expandedGroups.has('not-applied') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {grouped.notApplied.map((status, idx) => (
              <Card key={status.programId || idx} className="border-l-4 border-l-gray-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Disponible
                        </span>
                      </div>
                      
                      {/* Program Details */}
                      {status.program && (
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {status.program.name || 'Programa sin nombre'}
                          </h3>
                          {status.program.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {status.program.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {status.program.type && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.type}
                              </Badge>
                            )}
                            {status.program.cohortCode && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.cohortCode}
                              </Badge>
                            )}
                            {status.program.year && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.year}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-gray-900">0%</span>
                        <span className="text-gray-600">0 / 7 pasos</span>
                        <span className="text-gray-500">Programa disponible</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        size="sm" 
                        onClick={() => router.push(`/onboarding/${status.programId}`)}
                        className="h-8 px-3"
                      >
                        Unirme
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Active Applications */}
      {grouped.active.length > 0 && (
        <Collapsible open={expandedGroups.has('active')} onOpenChange={() => toggleGroup('active')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Activas ({grouped.active.length})</span>
              </div>
              {expandedGroups.has('active') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {grouped.active.map((status, idx) => (
              <Card key={status.applicationId || idx} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(status)}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                        <span className="text-sm text-gray-500">#{status.applicationId?.slice(-6)}</span>
                      </div>
                      
                      {/* Program Details */}
                      {status.program && (
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {status.program.name || 'Programa sin nombre'}
                          </h3>
                          {status.program.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {status.program.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {status.program.type && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.type}
                              </Badge>
                            )}
                            {status.program.cohortCode && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.cohortCode}
                              </Badge>
                            )}
                            {status.program.year && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.year}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-gray-900">{status.progress}%</span>
                        <span className="text-gray-600">✔ {status.completedSteps?.length || 0} / 7 pasos</span>
                        <span className="text-gray-500">
                          {status.updatedAt ? new Date(status.updatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!status.isComplete && (
                        <Button 
                          size="sm" 
                          onClick={() => router.push(`/onboarding/${status.programId}`)}
                          className="h-8 px-3"
                        >
                          {status.hasApplication ? 'Continuar' : 'Comenzar'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Completed Applications */}
      {grouped.completed.length > 0 && (
        <Collapsible open={expandedGroups.has('completed')} onOpenChange={() => toggleGroup('completed')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Completadas ({grouped.completed.length})</span>
              </div>
              {expandedGroups.has('completed') ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {grouped.completed.map((status, idx) => (
              <Card key={status.applicationId || idx} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(status)}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                        <span className="text-sm text-gray-500">#{status.applicationId?.slice(-6)}</span>
                      </div>
                      
                      {/* Program Details */}
                      {status.program && (
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {status.program.name || 'Programa sin nombre'}
                          </h3>
                          {status.program.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {status.program.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {status.program.type && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.type}
                              </Badge>
                            )}
                            {status.program.cohortCode && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.cohortCode}
                              </Badge>
                            )}
                            {status.program.year && (
                              <Badge variant="outline" className="text-xs">
                                {status.program.year}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-green-600">100%</span>
                        <span className="text-gray-600">✔ 7 / 7 pasos</span>
                        <span className="text-gray-500">
                          {status.updatedAt ? new Date(status.updatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="outline" className="h-8 px-3"
                        onClick={() => router.push(`/applications/${status.applicationId}`)}
                      >
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
