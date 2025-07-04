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

// Schema de validación
const formSchema = z.object({
  // Paso 1: Datos Generales
  projectName: z.string().min(1, "El nombre del proyecto es requerido"),
  website: z.string().min(1, "La página web o perfil de redes sociales es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  industry: z.string().min(1, "La industria es requerida"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  
  
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
  teamMembers: z.array(z.object({
    fullName: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres"),
    howMet: z.string().min(10, "Debe explicar cómo se conocieron"),
    studentCode: z.string().min(1, "El código del alumno es requerido"),
    career: z.string().min(1, "La carrera es requerida"),
    cycle: z.string().min(1, "El ciclo es requerido"),
    phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
    universityEmail: z.string().email("Debe ser un email válido"),
    contactEmail: z.string().email("Debe ser un email válido"),
    linkedin: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
    university: z.array(z.string()).min(1, "Debe seleccionar al menos una universidad"),
    source: z.string().min(1, "La fuente es requerida"),
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
const parentCategories = [
    "Tech",
    "No Tech"
];

const industries = [
  "Ambiental",
  "Agricultura",
  "Biotecnología",
  "Comunicaciones",
  "Comida y bebida",
  "Construcción",
  "Consultoría",
  "Cuidado de la salud",
  "Educación",
  "Electrónica",
  "Energía",
  "Entretenimiento",
  "Financiera",
  "Ingeniería",
  "Indumentaria",
  "Logística",
  "Manufactura",
  "Química",
  "Retail",
  "Tecnología",
  "Otros"
];

const stages = [
  "Idea de negocio",
  "MVP (Prototipo mínimo viable)",
];


const projectOrigins = [
  "Proyecto de un curso",
  "Proyecto de tesis",
  "Idea de empredimiento",
  "Inqubalab",
];

const universities = [
  "Universidad Nacional Mayor de San Marcos",
  "Pontificia Universidad Católica del Perú",
  "Universidad de Lima",
  "Universidad del Pacífico",
  "Universidad de Piura",
  "Universidad Cayetano Heredia",
  "Universidad de Ingeniería y Tecnología",
  "Universidad Peruana de Ciencias Aplicadas",
  "Universidad San Ignacio de Loyola",
  "Universidad ESAN",
  "Otras"
];

const sources = [
  "Redes sociales",
  "Amigos",
  "Familia",
  "Universidad",
  "Eventos",
  "Internet",
  "Otros"
];

const sports = [
  "Fútbol",
  "Basketball",
  "Natación",
  "Voleibol",
];

const hobbies = [
  "Lectura",
  "Música",
  "Videojuegos",
  "Cocinar",
  "Viajar",
  "Fotografía",
  "Pintura",
  "Bailar",
  "Escribir",
  "Otro"
];

const moviesGenres = [
    "Acción",
    "Aventura",
    "Ciencia ficción",
    "Comedia",
    "Drama",
    "Fantasía",
    "Suspense",
    "Terror",
]

const steps = [
  { id: "datos-generales", title: "Datos Generales", description: "Información básica del proyecto" },
  { id: "impacto-origen", title: "Impacto y Origen", description: "Valor y origen del proyecto" },
  { id: "presentacion", title: "Presentación", description: "Video de presentación" },
  { id: "equipo", title: "Equipo", description: "Integrantes del proyecto" },
  { id: "preferencias", title: "Preferencias", description: "Gustos personales" },
  { id: "consentimiento", title: "Consentimiento", description: "Aceptación de términos" },
]

export default function FormularioPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const formRef = useRef<HTMLDivElement>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      website: "",
      industry: "",
      category: "",
      description: "",
      stage: "",
      problem: "",
      customerProfile: "",
      impact: "",
      opportunityValue: "",
      projectOrigin: "",
      specificSupport: "",
      videoUrl: "",
      teamMembers: [
        {
          fullName: "",
          lastName: "",
          dni: "",
          howMet: "",
          studentCode: "",
          career: "",
          cycle: "",
          phone: "",
          universityEmail: "",
          contactEmail: "",
          linkedin: "",
          university: [],
          source: "",
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
    // Validate all fields before submission
    const isValid = await form.trigger()
    if (!isValid) {
      console.log("Form has validation errors")
      return
    }
    
    console.log("Form data:", data)
    // Aquí se enviaría la data al backend
    alert("Formulario enviado exitosamente!")
  }

  const nextStep = async () => {
    console.log("Form data:", form.getValues()) 
    
    // Step-specific validation
    let isValid = false
    switch (currentStep) {
      case 0: // Datos Generales
        isValid = await form.trigger(['projectName', 'category', 'description', 'website', 'industry'])
        break
      case 1: // Impacto y Origen
        isValid = await form.trigger(['opportunityValue', 'projectOrigin', 'stage', 'problem', 'customerProfile', 'impact'])
        break
      case 2: // Presentación
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
        break
      case 3: // Equipo
        isValid = await form.trigger(['teamMembers'])
        break
      case 4: // Preferencias Personales
        isValid = await form.trigger(['favoriteSport', 'favoriteHobby', 'favoriteMovieGenre'])
        break
      case 5: // Consentimiento
        isValid = await form.trigger(['privacyConsent'])
        break
      default:
        isValid = false
    }
    
    console.log("Is valid:", isValid)
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
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
      fullName: "",
      lastName: "",
      dni: "",
      howMet: "",
      studentCode: "",
      career: "",
      cycle: "",
      phone: "",
      universityEmail: "",
      contactEmail: "",
      linkedin: "",
      university: [],
      source: "",
    })
  }

  // Focus automático en el primer campo de cada paso
  useEffect(() => {
    const firstInput = formRef.current?.querySelector('input, textarea, select') as HTMLElement
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100)
    }
  }, [currentStep])

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
              {/* Paso 1: Datos Generales */}
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Datos Generales</CardTitle>
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
                              {parentCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
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

              {/* Paso 2: Impacto y Origen */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Impacto y Origen</CardTitle>
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
                              {projectOrigins.map((origin) => (
                                <div key={origin} className="flex items-center space-x-2">
                                  <RadioGroupItem value={origin} id={origin} />
                                  <Label htmlFor={origin}>{origin}</Label>
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
                                    {stages.map((stage) => (
                                        <div key={stage} className="flex items-center space-x-2">
                                            <RadioGroupItem value={stage} id={stage} />
                                            <Label htmlFor={stage}>{stage}</Label>
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
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Presentación</CardTitle>
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
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Equipo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                            name={`teamMembers.${index}.fullName`}
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
                          name={`teamMembers.${index}.howMet`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>¿Cómo y cuándo se conocieron?</FormLabel>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`teamMembers.${index}.studentCode`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Código del alumno</FormLabel>
                                <FormControl>
                                  <Input placeholder="20230001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

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
                            name={`teamMembers.${index}.cycle`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ciclo</FormLabel>
                                <FormControl>
                                  <Input placeholder="6to ciclo" {...field} />
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
                            name={`teamMembers.${index}.universityEmail`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email universitario</FormLabel>
                                <FormControl>
                                  <Input placeholder="alumno@university.edu.pe" {...field} />
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

                        <FormField
                          control={form.control}
                          name={`teamMembers.${index}.university`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Universidad</FormLabel>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {universities.map((university) => (
                                  <div key={university} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${university}-${index}`}
                                      checked={field.value?.includes(university)}
                                      onCheckedChange={(checked) => {
                                        const currentUniversities = field.value || []
                                        if (checked) {
                                          field.onChange([...currentUniversities, university])
                                        } else {
                                          field.onChange(currentUniversities.filter(u => u !== university))
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`${university}-${index}`}>{university}</Label>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`teamMembers.${index}.source`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>¿Cómo se enteró del programa?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 gap-3"
                                >
                                  {sources.map((source) => (
                                    <div key={source} className="flex items-center space-x-2">
                                      <RadioGroupItem value={source} id={`${source}-${index}`} />
                                      <Label htmlFor={`${source}-${index}`}>{source}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}

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
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias Personales</CardTitle>
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
                              {sports.map((sport) => (
                                <SelectItem key={sport} value={sport}>
                                  {sport}
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
                              {hobbies.map((hobby) => (
                                <SelectItem key={hobby} value={hobby}>
                                  {hobby}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    //Si tuvieras que elegir un género de películas para ver, ¿cuál elegirías?This question is required.*
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
                                {moviesGenres.map((genre) => (
                                  <SelectItem key={genre} value={genre}>
                                    {genre}
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
              {currentStep === 5 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Consentimiento</CardTitle>
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
                disabled={currentStep === 0}
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
                    className="flex items-center"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex items-center">
                    Enviar Formulario
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