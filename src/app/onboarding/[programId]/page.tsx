"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Steps } from "@/components/ui/steps"
import { Form } from "@/components/ui/form"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { saveOnboardingStep, getOnboardingStep, getCurrentOnboardingStep } from "@/lib/utils/functions/onboarding"
import { signOut, useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { steps } from "@/lib/enum"
import Link from "next/link"

// Import step components
import {
  StepProgramSelection,
  StepGeneralData,
  StepImpactOrigin,
  StepPresentation,
  StepTeam,
  StepPreferences,
  StepConsent
} from "./steps"

// Import schema and types
import { formSchema, FormData, Program } from "./form-schema"

// Import utilities
import { getProgramsPublished, stepNames, defaultTeamMember, OnboardingStep } from "./utils"

export default function FormularioPage() {
  const { programId } = useParams();
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [programs, setPrograms] = useState<Program[]>([])
  const formRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programId: "",
      projectName: "",
      website: "",
      industry: "",
      category: "",
      description: "",
      ruc: "",
      foundingYear: "",
      stage: "",
      problem: "",
      customerProfile: "",
      impact: "",
      opportunityValue: "",
      projectOrigin: "",
      specificSupport: "",
      videoUrl: "",
      howMet: "",
      source: "",
      teamMembers: [defaultTeamMember],
      favoriteSport: "",
      favoriteHobby: "",
      favoriteMovieGenre: "",
      privacyConsent: false,
    },
  });

  useEffect(() => {
    if (programId) {
      form.setValue('programId', programId as string);
    }
  }, [programId, router]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  })

  const onSubmit = async (data: FormData) => {
    if (!session?.user) {
      alert("Debe iniciar sesión para continuar")
      return
    }

    setIsLoading(true)
    try {
      // Validate all fields before submission
      const isValid = await form.trigger(['privacyConsent'])
      if (!isValid) {
        console.log("Form has validation errors")
        return
      }
      
      // Save final step
      await saveOnboardingStep('consent', {
        privacyConsent: data.privacyConsent,
        programId: data.programId,
      })
      
      alert("Formulario enviado exitosamente!")
      router.push('/dashboard')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert("Error al enviar el formulario. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get programs published when the page is loaded
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programs = await getProgramsPublished();
        setPrograms(programs)
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  const nextStep = async () => {
    if (!session?.user) {
      alert("Debe iniciar sesión para continuar")
      return
    }

    setIsLoading(true)
    try {
      console.log("Form data:", form.getValues()) 
      
      // Step-specific validation
      let isValid = false
      let stepData: any = {}
      
      switch (currentStep) {
        case 0: // Selección de Programa
          isValid = await form.trigger(['programId'])
          if (isValid) {
            stepData = { 
              programId: form.getValues('programId') 
            }
          }
          break
        case 1: // Datos Generales
          isValid = await form.trigger(['programId', 'projectName', 'category', 'description', 'website', 'industry'])
          if (isValid) {
            const data = form.getValues()
            stepData = {
              programId: data.programId,
              projectName: data.projectName,
              website: data.website,
              category: data.category,
              industry: data.industry,
              description: data.description,
              ruc: data.ruc,
              foundingYear: data.foundingYear,
            }
          }
          break
        case 2: // Impacto y Origen
          isValid = await form.trigger(['programId', 'opportunityValue', 'projectOrigin', 'stage', 'problem', 'customerProfile', 'impact'])
          if (isValid) {
            const data = form.getValues()
            stepData = { 
              programId: data.programId,
              opportunityValue: data.opportunityValue,
              stage: data.stage,
              projectOrigin: data.projectOrigin,
              problem: data.problem,
              customerProfile: data.customerProfile,
              impact: data.impact,
            }
          }
          break
        case 3: // Presentación
          isValid = await form.trigger(['programId', 'videoUrl', 'videoFile', 'specificSupport'])
          // Additional custom validation for video requirement
          const formData = form.getValues()
          const hasVideoUrl = formData.videoUrl && formData.videoUrl.trim() !== ""
          const hasVideoFile = formData.videoFile
          if (!hasVideoUrl && !hasVideoFile) {
            form.setError('videoUrl', { 
              type: 'manual', 
              message: 'Debe subir un video o proporcionar una URL de video' 
            })
            isValid = false
          }
          if (isValid) {
            stepData = {
              programId: formData.programId,
              videoUrl: formData.videoUrl,
              videoFileName: formData.videoFile?.name,
              specificSupport: formData.specificSupport,
            }
          }
          break
        case 4: // Equipo
          const teamMembersFields = form.getValues('teamMembers').flatMap((_, index) => [
            `teamMembers.${index}.firstName`,
            `teamMembers.${index}.lastName`,
            `teamMembers.${index}.dni`,
            `teamMembers.${index}.phone`,
            `teamMembers.${index}.contactEmail`,
            `teamMembers.${index}.university`,
            `teamMembers.${index}.linkedin`,
          ] as const);

          isValid = await form.trigger(['source', ...teamMembersFields] as any)
          
          // Custom validation for howMet - only required if 2+ team members
          const teamMembers = form.getValues('teamMembers')
          const howMet = form.getValues('howMet')

          if (teamMembers.length >= 2) {
            if (!howMet || howMet.trim().length < 10) {
              console.log("howMet", howMet)
              form.setError('howMet', { 
                type: 'manual', 
                message: 'Debe explicar cómo se conocieron (mínimo 10 caracteres)' 
              })
              isValid = false
            } else {
              form.clearErrors('howMet')
            }
          }

          // Custom validation for Laureate university fields
          const laureateUniversities = ["upc", "upn", "cibertec"]

          for (let i = 0; i < teamMembers.length; i++) {
            const member = teamMembers[i]
            console.log("member", member)
            const isLaureateUniversity = laureateUniversities.includes(member.university)

            if (isLaureateUniversity) {
              // Validate student code
              if (!member.studentCode || member.studentCode.trim() === '') {
                form.setError(`teamMembers.${i}.studentCode`, {
                  type: 'manual',
                  message: 'El código de alumno es requerido para estudiantes de Laureate'
                })
                isValid = false
              }
              
              // Validate cycle
              if (!member.cycle || member.cycle.trim() === '') {
                form.setError(`teamMembers.${i}.cycle`, {
                  type: 'manual',
                  message: 'El ciclo es requerido para estudiantes de Laureate'
                })
                isValid = false
              }
              
              // Validate university email
              if (!member.universityEmail || member.universityEmail.trim() === '') {
                form.setError(`teamMembers.${i}.universityEmail`, {
                  type: 'manual',
                  message: 'El correo universitario es requerido para estudiantes de Laureate'
                })
                isValid = false
              }
            }

            // Validate other university name when "otras" is selected
            if (member.university === "otras") {
              if (!member.otherUniversity || member.otherUniversity.trim() === '') {
                form.setError(`teamMembers.${i}.otherUniversity`, {
                  type: 'manual',
                  message: 'Debe especificar el nombre de la universidad'
                })
                isValid = false
              }
            }
          }

          if (isValid) {
            stepData = {
              programId: form.getValues('programId'),
              howMet: howMet,
              source: form.getValues('source'),
              teamMembers: teamMembers,
            }
          }
          break
        case 5: // Preferencias Personales
          isValid = await form.trigger(['programId', 'favoriteSport', 'favoriteHobby', 'favoriteMovieGenre'])
          if (isValid) {
            const data = form.getValues()
            stepData = {
              programId: data.programId,
              favoriteSport: data.favoriteSport,
              favoriteHobby: data.favoriteHobby,
              favoriteMovieGenre: data.favoriteMovieGenre,
            }
          }
          break
        case 6: // Consentimiento
          isValid = await form.trigger(['privacyConsent'])
          break
        default:
          isValid = false
      }
      
      console.log("Is valid:", isValid)
      if (isValid && currentStep < steps.length - 1) {
        // Save step data to API
        if (stepData && Object.keys(stepData).length > 0) {
          await saveOnboardingStep(stepNames[currentStep], stepData)
        }

        // get data for the next step but if the next step is the last step, set the current step to the last step
        if (currentStep < steps.length - 1) {
          const nextStepData = await getOnboardingStep(stepNames[currentStep + 1], programId as string)

          // Update the form with the next step data
          if (nextStepData.data) {
            // Populate form with existing data
            switch (stepNames[currentStep + 1]) {
              case 'program-selection': // program-selection
                form.setValue('programId', nextStepData.data.programId || '')
                break
              case 'general-data': // general-data
                form.setValue('projectName', nextStepData.data.projectName || '')
                form.setValue('website', nextStepData.data.website || '')
                form.setValue('category', nextStepData.data.category || '')
                form.setValue('industry', nextStepData.data.industry || '')
                form.setValue('description', nextStepData.data.description || '')
                form.setValue('ruc', nextStepData.data.ruc || '')
                form.setValue('foundingYear', nextStepData.data.foundingYear || '')
                break
              case 'impact-origin': // impact-origin
                form.setValue('opportunityValue', nextStepData.data.opportunityValue || '')
                form.setValue('stage', nextStepData.data.stage || '')
                form.setValue('projectOrigin', nextStepData.data.projectOrigin || '')
                form.setValue('problem', nextStepData.data.problem || '')
                form.setValue('customerProfile', nextStepData.data.customerProfile || '')
                form.setValue('impact', nextStepData.data.impact || '')
                break
              case 'presentation': // presentation
                form.setValue('videoUrl', nextStepData.data.videoUrl || '')
                form.setValue('specificSupport', nextStepData.data.specificSupport || '')
                break
              case 'team': // team
                form.setValue('howMet', nextStepData.data.howMet || '')
                form.setValue('source', nextStepData.data.source || '')

                nextStepData.data.teamMembers.forEach((member: any, index: number) => {
                  form.setValue(`teamMembers.${index}.firstName`, member.firstName || "")
                  form.setValue(`teamMembers.${index}.lastName`, member.lastName || "")
                  form.setValue(`teamMembers.${index}.dni`, member.dni || "")
                  form.setValue(`teamMembers.${index}.studentCode`, member.studentCode || "")
                  form.setValue(`teamMembers.${index}.cycle`, member.cycle || "")
                  form.setValue(`teamMembers.${index}.phone`, member.phone || "")
                  form.setValue(`teamMembers.${index}.universityEmail`, member.universityEmail || "")
                  form.setValue(`teamMembers.${index}.contactEmail`, member.contactEmail || "")
                  form.setValue(`teamMembers.${index}.linkedin`, member.linkedin || "")
                  form.setValue(`teamMembers.${index}.university`, member.university || "")
                  form.setValue(`teamMembers.${index}.otherUniversity`, member.otherUniversity || "")
                  form.setValue(`teamMembers.${index}.career`, member.career || "")
                });
                break
              case 'preferences': // preferences
                form.setValue('favoriteSport', nextStepData.data.favoriteSport || '')
                form.setValue('favoriteHobby', nextStepData.data.favoriteHobby || '')
                form.setValue('favoriteMovieGenre', nextStepData.data.favoriteMovieGenre || '')
                break
              case 'consent': // consent
                form.setValue('privacyConsent', nextStepData.data.privacyConsent || false)
                break
            }
          }
        }
        
        setCurrentStep(currentStep + 1)
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    } catch (error) {
      console.error('Error saving step:', error)
      alert("Error al guardar el paso. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const addTeamMember = () => {
    append(defaultTeamMember)
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  // Initialize form with existing data
  useEffect(() => {
    const initializeForm = async () => {
      if (status === 'loading') return
      
      if (!session?.user) return

      if (!programId) return
      
      try {
        // First, get the current step from the database
        const currentStepInfo = await getCurrentOnboardingStep(programId as string)

        // Force the current step to be consent if the onboarding is completed
        if (currentStepInfo.currentStep === "completed") {
          currentStepInfo.currentStep = "consent"
        }
        
        if (currentStepInfo.hasApplication && currentStepInfo.currentStep) {
          // User has an application, set the current step
          const currentStepIndex = stepNames.indexOf(currentStepInfo.currentStep as OnboardingStep)
          if (currentStepIndex !== -1) {
            setCurrentStep(currentStepIndex)
          }
        }
        
        // Determine how many steps to load based on current step
        let stepsToLoad = 0
        if (currentStepInfo.hasApplication && currentStepInfo.currentStep) {
          const currentStepIndex = stepNames.indexOf(currentStepInfo.currentStep as OnboardingStep)
          if (currentStepIndex !== -1) {
            stepsToLoad = currentStepIndex + 1 // Load up to and including current step
          }
        }
        
        // Load data only for completed steps (up to current step)
        for (let i = 0; i < stepsToLoad; i++) {
          try {
            const response = await getOnboardingStep(stepNames[i], programId as string)
            if (response.data) {
              // Populate form with existing data
              switch (i) {
                case 0: // program-selection
                  form.setValue('programId', response.data.programId || '')
                  break
                case 1: // general-data
                  form.setValue('projectName', response.data.projectName || '')
                  form.setValue('website', response.data.website || '')
                  form.setValue('category', response.data.category || '')
                  form.setValue('industry', response.data.industry || '')
                  form.setValue('description', response.data.description || '')
                  form.setValue('ruc', response.data.ruc || '')
                  form.setValue('foundingYear', response.data.foundingYear || '')
                  break
                case 2: // impact-origin
                  form.setValue('opportunityValue', response.data.opportunityValue || '')
                  form.setValue('stage', response.data.stage || '')
                  form.setValue('projectOrigin', response.data.projectOrigin || '')
                  form.setValue('problem', response.data.problem || '')
                  form.setValue('customerProfile', response.data.customerProfile || '')
                  form.setValue('impact', response.data.impact || '')
                  break
                case 3: // presentation
                  form.setValue('videoUrl', response.data.videoUrl || '')
                  form.setValue('specificSupport', response.data.specificSupport || '')
                  break
                case 4: // team
                  form.setValue('howMet', response.data.howMet || '')
                  form.setValue('source', response.data.source || '')
                  if (response.data.teamMembers && response.data.teamMembers.length > 0) {
                    response.data.teamMembers.forEach((member: any, index: number) => {
                      form.setValue(`teamMembers.${index}.firstName`, member.firstName || "")
                      form.setValue(`teamMembers.${index}.lastName`, member.lastName || "")
                      form.setValue(`teamMembers.${index}.dni`, member.dni || "")
                      form.setValue(`teamMembers.${index}.studentCode`, member.studentCode || "")
                      form.setValue(`teamMembers.${index}.cycle`, member.cycle || "")
                      form.setValue(`teamMembers.${index}.phone`, member.phone || "")
                      form.setValue(`teamMembers.${index}.career`, member.career || "")
                      form.setValue(`teamMembers.${index}.universityEmail`, member.universityEmail || "")
                      form.setValue(`teamMembers.${index}.contactEmail`, member.contactEmail || "")
                      form.setValue(`teamMembers.${index}.linkedin`, member.linkedin || "")
                      form.setValue(`teamMembers.${index}.university`, member.university || "")
                      form.setValue(`teamMembers.${index}.otherUniversity`, member.otherUniversity || "")
                      form.setValue(`teamMembers.${index}.career`, member.career || "")
                    })
                  }
                  break
                case 5: // preferences
                  form.setValue('favoriteSport', response.data.favoriteSport || '')
                  form.setValue('favoriteHobby', response.data.favoriteHobby || '')
                  form.setValue('favoriteMovieGenre', response.data.favoriteMovieGenre || '')
                  break
                case 6: // consent
                  form.setValue('privacyConsent', response.data.privacyConsent || false)
                  break
              }
            }
          } catch (error) {
            console.error(`Error loading step ${stepNames[i]}:`, error)
            // Continue loading other steps even if one fails
          }
        }
        
      } catch (error) {
        console.error('Error initializing form:', error)
      } finally {
        setIsInitializing(false)
      }
    }
    
    initializeForm()
  }, [session, status, router, form])

  // Focus automático en el primer campo de cada paso
  useEffect(() => {
    if (isInitializing) return
    
    const firstInput = formRef.current?.querySelector('input, textarea, select') as HTMLElement
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100)
    }
  }, [currentStep, isInitializing])

  // Show loading state while initializing
  if (isInitializing || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando formulario...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="flex container justify-end max-w-4xl mx-auto mb-8 space-x-4">
        <>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            onClick={() => signOut()}
          >
            Cerrar sesión
          </Button>
        </>
      </div>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Formulario de Proyecto</h1>
          <p className="text-gray-600">Complete todos los pasos para registrar su proyecto</p>
        </div>

        <Steps steps={steps} currentStep={currentStep} className="mb-8" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div ref={formRef}>
              {/* Paso 0: Selección de Programa */}
              {currentStep === 0 && (
                <StepProgramSelection 
                  form={form} 
                  programs={programs} 
                  programId={programId as string} 
                />
              )}

              {/* Paso 1: Datos Generales */}
              {currentStep === 1 && (
                <StepGeneralData form={form} />
              )}

              {/* Paso 2: Impacto y Origen */}
              {currentStep === 2 && (
                <StepImpactOrigin form={form} />
              )}

              {/* Paso 3: Presentación */}
              {currentStep === 3 && (
                <StepPresentation form={form} />
              )}

              {/* Paso 4: Equipo */}
              {currentStep === 4 && (
                <StepTeam 
                  form={form} 
                  fields={fields} 
                  append={addTeamMember} 
                  remove={remove} 
                />
              )}

              {/* Paso 5: Preferencias Personales */}
              {currentStep === 5 && (
                <StepPreferences form={form} />
              )}

              {/* Paso 6: Consentimiento */}
              {currentStep === 6 && (
                <StepConsent 
                  form={form} 
                  programs={programs} 
                  goToStep={goToStep} 
                />
              )}
            </div>

            {/* Navegación */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0 || isLoading || isInitializing}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Atrás
              </Button>

              <div className="flex gap-2">
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading || isInitializing}
                    className="flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={() => {
                      onSubmit(form.getValues())
                    }}
                    disabled={isLoading || isInitializing}
                    className="flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Formulario'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 