"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Steps } from "@/components/ui/steps"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { saveOnboardingStep, getOnboardingStep, getCurrentOnboardingStep, OnboardingStep } from "@/lib/utils/functions/onboarding"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Schema de validación
const formSchema = z.object({
  // Paso 0: Selección de Programa
  programType: z.string().min(1, "Debe seleccionar un tipo de programa"),
  
  // Paso 1: Datos Generales
  projectName: z.string().min(1, "El nombre del proyecto es requerido"),
  website: z.string().min(1, "La página web o perfil de redes sociales es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  industry: z.string().min(1, "La industria es requerida"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  ruc: z.string().optional(),
  foundingYear: z.string().optional(),
  
  
  // Paso 2: Impacto y Origen
  opportunityValue: z.string().min(10, "Debe explicar por qué es valiosa la oportunidad"),
  stage: z.string().min(1, "La etapa es requerida"),
  projectOrigin: z.string().min(1, "El origen del proyecto es requerido"),
  problem: z.string().min(10, "Debe explicar el problema o oportunidad que su proyecto resuelve"),
  customerProfile: z.string().min(10, "Debe describir el perfil de tu usuario / cliente objetivo"),
  impact: z.string().min(10, "Debe explicar el impacto positivo de tu proyecto o potencial de impacto"),
  
  // Paso 3: Presentación
  videoUrl: z.string().optional(),
  videoFile: z.any().optional(),
  specificSupport: z.string().min(10, "Debe especificar el apoyo que busca"),

  
  // Paso 4: Equipo
  howMet: z.string().optional(),
  source: z.string().min(1, "La fuente es requerida"),
  teamMembers: z.array(z.object({
    firstName: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres"),
    studentCode: z.string().optional(),
    career: z.string().min(1, "La carrera es requerida"),
    cycle: z.string().optional(),
    phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
    universityEmail: z.string().email("Debe ser un email válido").optional().or(z.literal("")),
    contactEmail: z.string().email("Debe ser un email válido"),
    linkedin: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
    university: z.string().min(1, "Debe seleccionar una universidad"),
    otherUniversity: z.string().optional(),
  })).min(1, "Debe agregar al menos un integrante"),
  
  // Paso 5: Preferencias Personales
  favoriteSport: z.string().min(1, "El deporte favorito es requerido"),
  favoriteHobby: z.string().min(1, "El hobby favorito es requerido"),
  favoriteMovieGenre: z.string().min(1, "El género de películas favorito es requerido"),
  
  // Paso 6: Consentimiento
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Debe aceptar el aviso de privacidad"
  }),
})

type FormData = z.infer<typeof formSchema>

// Datos estáticos para las opciones
const parentCategories = {
  tech: "Tech",
  noTech: "No Tech"
};

const industries = {
  ambiental: "Ambiental",
  agricultura: "Agricultura",
  biotecnologia: "Biotecnología",
  comunicaciones: "Comunicaciones",
  comidaBebida: "Comida y bebida",
  construccion: "Construcción",
  consultoria: "Consultoría",
  cuidadoSalud: "Cuidado de la salud",
  educacion: "Educación",
  electronica: "Electrónica",
  energia: "Energía",
  entretenimiento: "Entretenimiento",
  financiera: "Financiera",
  ingenieria: "Ingeniería",
  indumentaria: "Indumentaria",
  logistica: "Logística",
  manufactura: "Manufactura",
  quimica: "Química",
  retail: "Retail",
  tecnologia: "Tecnología",
  otros: "Otros"
};

const stages = {
  ideaNegocio: "Idea de negocio",
  mvp: "MVP (Prototipo mínimo viable)",
};

const projectOrigins = {
  proyectoCurso: "Proyecto de un curso",
  proyectoTesis: "Proyecto de tesis",
  ideaEmprendimiento: "Idea de empredimiento",
  inqubalab: "Inqubalab",
};

const universities = {
  unmsm: "Universidad Nacional Mayor de San Marcos",
  pucp: "Pontificia Universidad Católica del Perú",
  ulima: "Universidad de Lima",
  up: "Universidad del Pacífico",
  udep: "Universidad de Piura",
  uch: "Universidad Cayetano Heredia",
  utec: "Universidad de Ingeniería y Tecnología",
  upc: "Universidad Peruana de Ciencias Aplicadas (Laureate)",
  upn: "Universidad Privada del Norte (Laureate)",
  usil: "Universidad San Ignacio de Loyola",
  esan: "Universidad ESAN",
  cibertec: "Cibertec (Laureate)",
  otras: "Otras"
};

const sources = {
  redesSociales: "Redes sociales",
  amigos: "Amigos",
  familia: "Familia",
  universidad: "Universidad",
  eventos: "Eventos",
  internet: "Internet",
  otros: "Otros"
};

const sports = {
  futbol: "Fútbol",
  basketball: "Basketball",
  natacion: "Natación",
  voleibol: "Voleibol",
};

const hobbies = {
  lectura: "Lectura",
  musica: "Música",
  videojuegos: "Videojuegos",
  cocinar: "Cocinar",
  viajar: "Viajar",
  fotografia: "Fotografía",
  pintura: "Pintura",
  bailar: "Bailar",
  escribir: "Escribir",
  otro: "Otro"
};

const moviesGenres = {
  accion: "Acción",
  aventura: "Aventura",
  cienciaFiccion: "Ciencia ficción",
  comedia: "Comedia",
  drama: "Drama",
  fantasia: "Fantasía",
  suspense: "Suspense",
  terror: "Terror",
};

const programTypes = [
  {
    id: "inqubalab",
    title: "Inqubalab",
    description: "Programa de incubación para ideas de negocio",
    icon: "🚀"
  },
  {
    id: "idea-feedback",
    title: "Idea Feedback",
    description: "Programa de retroalimentación para ideas",
    icon: "💡"
  },
  {
    id: "aceleracion",
    title: "Aceleración",
    description: "Programa de aceleración para startups",
    icon: "⚡"
  }
];


const steps = [
  { id: "program-selection", title: "Selección de Programa", description: "Elija el programa que desea" },
  { id: "general-data", title: "Datos Generales", description: "Información básica del proyecto" },
  { id: "impact-origin", title: "Impacto y Origen", description: "Valor y origen del proyecto" },
  { id: "presentation", title: "Presentación", description: "Video de presentación" },
  { id: "team", title: "Equipo", description: "Integrantes del proyecto" },
  { id: "preferences", title: "Preferencias", description: "Gustos personales" },
  { id: "consent", title: "Consentimiento", description: "Aceptación de términos" },
]

export default function FormularioPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const formRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programType: "",
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
      teamMembers: [
        {
          firstName: "",
          lastName: "",
          dni: "",
          studentCode: "",
          career: "",
          cycle: "",
          phone: "",
          universityEmail: "",
          contactEmail: "",
          linkedin: "",
          university: "",
          otherUniversity: "",
        }
      ],
      favoriteSport: "",
      favoriteHobby: "",
      favoriteMovieGenre: "",
      privacyConsent: false,
    },
  })

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
        privacyConsent: data.privacyConsent
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
          isValid = await form.trigger(['programType'])
          if (isValid) {
            stepData = { programType: form.getValues('programType') }
          }
          break
        case 1: // Datos Generales
          isValid = await form.trigger(['projectName', 'category', 'description', 'website', 'industry'])
          if (isValid) {
            const data = form.getValues()
            stepData = {
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
          isValid = await form.trigger(['opportunityValue', 'projectOrigin', 'stage', 'problem', 'customerProfile', 'impact'])
          if (isValid) {
            const data = form.getValues()
            stepData = {
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
          isValid = await form.trigger(['videoUrl', 'videoFile', 'specificSupport'])
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
          const laureateUniversities = [
            "upc",
            "upn",
            "cibertec"
          ]

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
              howMet: howMet,
              source: form.getValues('source'),
              teamMembers: teamMembers,
            }
          }
          break
        case 5: // Preferencias Personales
          isValid = await form.trigger(['favoriteSport', 'favoriteHobby', 'favoriteMovieGenre'])
          if (isValid) {
            const data = form.getValues()
            stepData = {
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
        const stepNames: OnboardingStep[] = [
          'program-selection',
          'general-data', 
          'impact-origin',
          'presentation',
          'team',
          'preferences',
          'consent'
        ]
        
        if (stepData && Object.keys(stepData).length > 0) {
          await saveOnboardingStep(stepNames[currentStep], stepData)
        }

        // get data for the next step but if the next step is the last step, set the current step to the last step
        if (currentStep < steps.length - 1) {
          const nextStepData = await getOnboardingStep(stepNames[currentStep + 1])

          // Update the form with the next step data
          if (nextStepData.data) {
                // Populate form with existing data
                switch (stepNames[currentStep + 1]) {
                  case 'program-selection': // program-selection
                    form.setValue('programType', nextStepData.data.programType || '')
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
    append({
      firstName: "",
      lastName: "",
      dni: "",
      studentCode: "",
      career: "",
      cycle: "",
      phone: "",
      universityEmail: "",
      contactEmail: "",
      linkedin: "",
      university: "",
      otherUniversity: "",
    })
  }

  // Initialize form with existing data
  useEffect(() => {
    const initializeForm = async () => {
      if (status === 'loading') return
      
      
      if (!session?.user) return
      
      try {
        // First, get the current step from the database
        const currentStepInfo = await getCurrentOnboardingStep()
        
        if (currentStepInfo.hasApplication && currentStepInfo.currentStep) {
          // User has an application, set the current step
          const stepNames: OnboardingStep[] = [
            'program-selection',
            'general-data', 
            'impact-origin',
            'presentation',
            'team',
            'preferences',
            'consent'
          ]
          
          const currentStepIndex = stepNames.indexOf(currentStepInfo.currentStep as OnboardingStep)
          if (currentStepIndex !== -1) {
            setCurrentStep(currentStepIndex)
          }
        }
        
        // Load existing data only up to the current step
        const stepNames: OnboardingStep[] = [
          'program-selection',
          'general-data', 
          'impact-origin',
          'presentation',
          'team',
          'preferences',
          'consent'
        ]
        
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
            const response = await getOnboardingStep(stepNames[i])
            if (response.data) {
              // Populate form with existing data
              switch (i) {
                case 0: // program-selection
                  form.setValue('programType', response.data.programType || '')
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
                    // Clear existing team members and add the loaded ones
                    //form.setValue('teamMembers', response.data.teamMembers)
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
                <Card>
                  <CardHeader>
                    <CardTitle>Seleccione el Programa</CardTitle>
                    <p className="text-sm text-gray-600">
                      Elige el programa que mejor se adapte a la etapa de tu proyecto. Cada programa ofrece diferentes niveles de apoyo y recursos.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="programType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Tipo de Programa</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {programTypes.map((program) => (
                              <div
                                key={program.id}
                                className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all hover:border-primary ${
                                  field.value === program.id
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                                onClick={() => field.onChange(program.id)}
                              >
                                <div className="flex flex-col items-center text-center space-y-3">
                                  <div className="text-3xl">{program.icon}</div>
                                  <div>
                                    <h3 className="font-semibold text-lg">{program.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                                  </div>
                                </div>
                                {field.value === program.id && (
                                  <div className="absolute top-2 right-2">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Paso 1: Datos Generales */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Datos Generales</CardTitle>
                    <p className="text-sm text-gray-600">
                      Información básica sobre tu proyecto o emprendimiento. Incluye el nombre, categoría, industria y descripción detallada.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del proyecto</FormLabel>
                          <FormControl>
                            <Input placeholder="Ingrese el nombre de su proyecto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(parentCategories).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pagina Web o perfil de redes sociales</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describa su proyecto en detalle"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industria a la que pertenece tu proyecto o emprendimiento</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione la industria" />
                                </SelectTrigger>
                              </FormControl>
                                                          <SelectContent>
                              {Object.entries(industries).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Información de la empresa - Solo para Aceleración */}
                    {form.watch("programType") === "aceleracion" && (
                      <div className="space-y-6 pt-6 border-t">
                        <div>
                          <h4 className="text-md font-semibold mb-4">Información de la Empresa</h4>
                          <p className="text-sm text-gray-600 mb-4">Información adicional para empresas en aceleración (opcional)</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="ruc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>RUC (opcional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="20123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="foundingYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Año de fundación (opcional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="2020" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}


                  </CardContent>
                </Card>
              )}

              {/* Paso 2: Impacto y Origen */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Impacto y Origen</CardTitle>
                    <p className="text-sm text-gray-600">
                      Cuéntanos sobre el origen de tu proyecto, el problema que resuelve, tu cliente objetivo y el impacto que esperas generar.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    <FormField
                      control={form.control}
                      name="projectOrigin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>El proyecto proviene de:</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-3"
                            >
                              {Object.entries(projectOrigins).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-2">
                                  <RadioGroupItem value={key} id={key} />
                                  <Label htmlFor={key}>{value}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stage"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>En que etapa se encuentra el proyecto?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-1 gap-3"
                                >
                                                                    {Object.entries(stages).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <RadioGroupItem value={key} id={key} />
                                        <Label htmlFor={key}>{value}</Label>
                                    </div>
                                ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="problem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cual es el problema u oportunidad que tu proyecto resuelve?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Explique el problema o oportunidad que su proyecto resuelve"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="opportunityValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>¿Por qué es valiosa la oportunidad?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Explique el valor y potencial de su oportunidad"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe el perfil de tu usuario / cliente objetivo</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe el perfil de tu usuario / cliente objetivo"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="impact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cual es el impacto positivo de tu proyecto o potencial de impacto?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe el impacto positivo de tu proyecto o potencial de impacto"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    
                  </CardContent>
                </Card>
              )}

              {/* Paso 3: Presentación */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Presentación</CardTitle>
                    <p className="text-sm text-gray-600">
                      Comparte un video de presentación de tu proyecto y especifica qué tipo de apoyo estás buscando para tu emprendimiento.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="videoFile">Subir video (opcional)</Label>
                        <Input
                          id="videoFile"
                          type="file"
                          accept="video/*"
                          className="mt-2"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              form.setValue("videoFile", file)
                            }
                          }}
                        />
                        {form.watch("videoFile") && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Video seleccionado:</span>{" "}
                            <span className="truncate">
                              {form.watch("videoFile")?.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>O proporcione una URL de video:</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL del video</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://youtube.com/watch?v=..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="specificSupport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apoyo puntual que buscas</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describa el tipo de apoyo específico que necesita"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Paso 4: Equipo */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Equipo</CardTitle>
                    <p className="text-sm text-gray-600">
                      Información de todos los integrantes del equipo. Incluye datos académicos, de contacto y cómo se conocieron.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>¿Cómo se enteró del programa?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 gap-3"
                              >
                                {Object.entries(sources).map(([key, value]) => (
                                  <div key={key} className="flex items-center space-x-2">
                                    <RadioGroupItem value={key} id={key} />
                                    <Label htmlFor={key}>{value}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                    />

                    {fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Integrante {index + 1}</h3>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.firstName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombres</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nombres" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.lastName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Apellidos</FormLabel>
                                <FormControl>
                                  <Input placeholder="Apellidos" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.dni`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>DNI</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345678" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`teamMembers.${index}.university`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Universidad</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione una universidad" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(universities).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Campo para especificar otra universidad */}
                        {form.watch(`teamMembers.${index}.university`) === "otras" && (
                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.otherUniversity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Especifique el nombre de la universidad</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ingrese el nombre de su universidad" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Fields only for Laureate universities */}
                        {(() => {
                          const selectedUniversity = form.watch(`teamMembers.${index}.university`)
                          const laureateUniversities = [
                            "upc",
                            "upn",
                            "cibertec"
                          ]
                          const isLaureateUniversity = laureateUniversities.includes(selectedUniversity)
                          
                          return isLaureateUniversity ? (
                            <div className="space-y-4 pt-4 border-t">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-800 font-medium mb-3">
                                  Información adicional para estudiantes de Laureate
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                  <FormField
                                    control={form.control}
                                    name={`teamMembers.${index}.studentCode`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col h-full">
                                        <FormLabel>Código de Alumno</FormLabel>
                                        <FormControl>
                                          <Input placeholder="20230001" {...field} />
                                        </FormControl>
                                        <div className="flex-1 min-h-[20px] flex items-end">
                                          <FormMessage />
                                        </div>
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`teamMembers.${index}.cycle`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col h-full">
                                        <FormLabel>Ciclo en el que te encuentras</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Seleccione el ciclo" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map((cycle) => {
                                              const ordinalMap: { [key: number]: string } = {
                                                1: "1er",
                                                2: "2do", 
                                                3: "3er",
                                                4: "4to",
                                                5: "5to",
                                                6: "6to",
                                                7: "7mo",
                                                8: "8vo",
                                                9: "9no",
                                                10: "10mo"
                                              }
                                              return (
                                                <SelectItem key={cycle} value={cycle.toString()}>
                                                  {ordinalMap[cycle]} Ciclo
                                                </SelectItem>
                                              )
                                            })}
                                          </SelectContent>
                                        </Select>
                                        <div className="flex-1 min-h-[20px] flex items-end">
                                          <FormMessage />
                                        </div>
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`teamMembers.${index}.universityEmail`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col h-full">
                                        <FormLabel>Correo universitario</FormLabel>
                                        <FormControl>
                                          <Input placeholder="alumno@university.edu.pe" {...field} />
                                        </FormControl>
                                        <div className="flex-1 min-h-[20px] flex items-end">
                                          <FormMessage />
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : null
                        })()}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.career`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Carrera</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ingeniería de Sistemas" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.phone`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                  <Input placeholder="999888777" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.contactEmail`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email de contacto</FormLabel>
                                <FormControl>
                                  <Input placeholder="contacto@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.linkedin`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn (opcional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://linkedin.com/in/usuario" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        

                        


                      </div>
                    ))}

                    {fields.length >= 2 && (
                      <div className="space-y-6 pt-6 border-t">
                        <FormField
                          control={form.control}
                          name="howMet"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                ¿Cómo y cuándo se conocieron?
                                <span className="text-red-500 ml-1">*</span>
                              </FormLabel>
                              <p className="text-sm text-gray-600 mb-2">
                                Este campo es requerido cuando hay 2 o más integrantes en el equipo.
                              </p>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describa cómo y cuándo se conocieron los integrantes"
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTeamMember}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Integrante
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Paso 5: Preferencias Personales */}
              {currentStep === 5 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias Personales</CardTitle>
                    <p className="text-sm text-gray-600">
                      Conoce un poco más sobre tus gustos personales. Esta información nos ayuda a personalizar tu experiencia.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="favoriteSport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deporte favorito</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione su deporte favorito" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(sports).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="favoriteHobby"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hobby favorito</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione su hobby favorito" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(hobbies).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="favoriteMovieGenre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Si tuvieras que elegir un género de películas para ver, ¿cuál elegirías?</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione su género de películas favorito" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(moviesGenres).map(([key, value]) => (
                                  <SelectItem key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>

                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Paso 6: Consentimiento */}
              {currentStep === 6 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Consentimiento</CardTitle>
                    <p className="text-sm text-gray-600">
                      Revisa y acepta los términos y condiciones, así como el aviso de privacidad para completar tu registro.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="privacyConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Acepto el aviso de privacidad y los términos y condiciones
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
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