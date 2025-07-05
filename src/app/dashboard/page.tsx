"use client";

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getOnboardingStatus, getCurrentOnboardingStep } from '@/lib/utils/functions/onboarding'
import { CheckCircle, ArrowRight, PlayCircle } from 'lucide-react'

interface OnboardingStatus {
  hasApplication: boolean
  currentStep: string | null
  completedSteps: string[]
  progress: number
  isComplete: boolean
  applicationId?: string
  createdAt?: string
  updatedAt?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOnboardingStatus = async () => {
      if (status === 'loading') return
      
      if (status === 'unauthenticated') {
        router.push('/login')
        return
      }
      
      if (!session?.user) return
      
      try {
        const status = await getOnboardingStatus()
        const currentStep = await getCurrentOnboardingStep()
        
        // Update the status with the current step information
        setOnboardingStatus({
          ...status,
          currentStep: currentStep.currentStep
        })
      } catch (error) {
        console.error('Error loading onboarding status:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadOnboardingStatus()
  }, [session, status, router])

  const getStepName = (step: string) => {
    const stepNames: { [key: string]: string } = {
      'program-selection': 'Selección de Programa',
      'general-data': 'Datos Generales',
      'impact-origin': 'Impacto y Origen',
      'presentation': 'Presentación',
      'team': 'Equipo',
      'preferences': 'Preferencias',
      'consent': 'Consentimiento'
    }
    return stepNames[step] || step
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bienvenido, {session?.user?.name || session?.user?.email}</p>
        </div>

        {onboardingStatus && (
          <div className="space-y-6">
            {/* Onboarding Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {onboardingStatus.isComplete ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <PlayCircle className="h-6 w-6 text-blue-600" />
                  )}
                  Formulario de Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Progreso del formulario
                  </span>
                  <span className="text-sm text-gray-500">
                    {onboardingStatus.progress}% completado
                  </span>
                </div>
                
                <Progress value={onboardingStatus.progress} className="w-full" />
                
                <div className="space-y-2">
                  {onboardingStatus.completedSteps.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
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
                </div>

                <div className="pt-4">
                  {onboardingStatus.isComplete ? (
                    <div className="text-center">
                      <p className="text-green-600 font-medium mb-2">
                        ¡Formulario completado exitosamente!
                      </p>
                      <p className="text-sm text-gray-600">
                        Tu aplicación ha sido enviada y está siendo revisada.
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => router.push('/onboarding')}
                      className="w-full"
                    >
                      {onboardingStatus.hasApplication ? 'Continuar Formulario' : 'Comenzar Formulario'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>

                {onboardingStatus.hasApplication && onboardingStatus.applicationId && (
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
              </CardContent>
            </Card>

            {/* Additional dashboard content can be added here */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos pasos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {onboardingStatus.isComplete 
                    ? "Tu aplicación está siendo revisada. Te notificaremos cuando tengamos novedades."
                    : "Completa el formulario de proyecto para continuar con el proceso de aplicación."
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 