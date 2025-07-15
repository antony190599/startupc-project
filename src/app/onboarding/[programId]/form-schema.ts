import * as z from "zod"

// Schema de validación
export const formSchema = z.object({
  // Paso 0: Selección de Programa
  programId: z.string().min(1, "Debe seleccionar un programa"),
  
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

export type FormData = z.infer<typeof formSchema>

export interface Program {
  id: string;
  name: string;
  description: string;
  programType: string;
  programStatus: string;
  year: string | null;
  cohortCode: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramsResponse {
  rows: Program[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
} 