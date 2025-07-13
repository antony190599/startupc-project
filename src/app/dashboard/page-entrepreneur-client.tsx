"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingStatus, getCurrentOnboardingStep } from "@/lib/utils/functions/onboarding";
import Link from "next/link";

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
}

export default function EntrepreneurDashboardClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOnboardingStatus = async () => {
      if (!session?.user) return;
      
      try {
        const status = await getOnboardingStatus();
        const currentStep = await getCurrentOnboardingStep(status[0].programId as string);
        
        setOnboardingStatus({
          ...status[0],
          currentStep: currentStep.currentStep
        });
      } catch (error) {
        console.error('Error loading onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.user) {
      loadOnboardingStatus();
    }
  }, [session]);

  const getStepName = (step: string) => {
    const stepNames: { [key: string]: string } = {
      'program-selection': 'Selección de Programa',
      'general-data': 'Datos Generales',
      'impact-origin': 'Impacto y Origen',
      'presentation': 'Presentación',
      'team': 'Equipo',
      'preferences': 'Preferencias',
      'consent': 'Consentimiento'
    };
    return stepNames[step] || step;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Panel de Emprendedor</h1>
        <p className="text-gray-600">Gestiona tus proyectos y aplicaciones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Onboarding Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {onboardingStatus?.isComplete ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <PlayCircle className="h-6 w-6 text-blue-600" />
              )}
              Mi Proyecto
            </CardTitle>
            <CardDescription>Estado actual de tu aplicación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Eco Startup</h3>
                <p className="text-sm text-gray-600">Programa: Inqubalab</p>
                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {onboardingStatus?.isComplete ? 'En revisión' : 'En progreso'}
                  </span>
                </div>
              </div>
              
              {onboardingStatus && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Progreso del formulario
                    </span>
                    <span className="text-sm text-gray-500">
                      {onboardingStatus.progress}% completado
                    </span>
                  </div>
                  <Progress value={onboardingStatus.progress} className="w-full" />
                </div>
              )}

              {onboardingStatus?.completedSteps && onboardingStatus.completedSteps.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Pasos completados:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {onboardingStatus.completedSteps.map((step) => (
                      <span
                        key={step}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {getStepName(step)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                {onboardingStatus?.isComplete ? (
                  <div className="text-center w-full">
                    <p className="text-green-600 font-medium mb-2">
                      ¡Formulario completado exitosamente!
                    </p>
                    <p className="text-sm text-gray-600">
                      Tu aplicación ha sido enviada y está siendo revisada.
                    </p>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => router.push(`/onboarding/${onboardingStatus?.programId}`)}
                    className="flex-1"
                  >
                    {onboardingStatus?.hasApplication ? 'Continuar formulario' : 'Comenzar formulario'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
                <Button size="sm" variant="outline">Ver detalles</Button>
              </div>

              {onboardingStatus?.hasApplication && onboardingStatus.applicationId && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    ID de aplicación: {onboardingStatus.applicationId}
                  </p>
                  {onboardingStatus.createdAt && (
                    <p className="text-xs text-gray-500">
                      Creado: {new Date(onboardingStatus.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  {onboardingStatus.updatedAt && (
                    <p className="text-xs text-gray-500">
                      Última actualización: {new Date(onboardingStatus.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events Card */}
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

    </div>
  );
}
