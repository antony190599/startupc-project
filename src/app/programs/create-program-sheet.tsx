"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProgramSchema, type CreateProgramInput } from "@/lib/zod/schemas"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ProgramTypes } from "@/lib/enum"


interface CreateProgramSheetProps {
  onProgramCreated?: () => void
}

export function CreateProgramSheet({ onProgramCreated }: CreateProgramSheetProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<CreateProgramInput>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      name: "",
      description: "",
      programType: ProgramTypes.INQUBALAB,
      programStatus: "active",
      year: null,
      cohortCode: null,
      startDate: null,
      endDate: null,
      status: "draft",
    },
  })

  const onSubmit = async (data: CreateProgramInput) => {
    try {
      setLoading(true)

      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear el programa")
      }

      const result = await response.json()

      if (result.success) {
        alert("Programa creado exitosamente")
        form.reset()
        setOpen(false)
        onProgramCreated?.()
      } else {
        throw new Error("Error al crear el programa")
      }
    } catch (error) {
      console.error("Error creating program:", error)
      alert(error instanceof Error ? error.message : "Error al crear el programa")
    } finally {
      setLoading(false)
    }
  }

  const getProgramTypeLabel = (type: string) => {
    switch (type) {
      case ProgramTypes.INQUBALAB:
        return "Inqubalab"
      case ProgramTypes.IDEA_FEEDBACK:
        return "Idea Feedback"
      case ProgramTypes.ACELERACION:
        return "Aceleración"
      default:
        return type
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear Programa
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Crear Nuevo Programa</SheetTitle>
          <SheetDescription>
            Completa la información para crear un nuevo programa. Los campos marcados con * son obligatorios.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nombre del Programa */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Programa *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Startup Accelerator 2025"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nombre descriptivo del programa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descripción */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el programa, sus objetivos y beneficios..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Descripción detallada del programa (mínimo 10 caracteres)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Programa */}
              <FormField
                control={form.control}
                name="programType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Programa *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de programa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ProgramTypes.INQUBALAB}>
                          {getProgramTypeLabel(ProgramTypes.INQUBALAB)}
                        </SelectItem>
                        <SelectItem value={ProgramTypes.IDEA_FEEDBACK}>
                          {getProgramTypeLabel(ProgramTypes.IDEA_FEEDBACK)}
                        </SelectItem>
                        <SelectItem value={ProgramTypes.ACELERACION}>
                          {getProgramTypeLabel(ProgramTypes.ACELERACION)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Categoría del programa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estado del Programa */}
              <FormField
                control={form.control}
                name="programStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado del Programa *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: active, inactive, planning"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Estado interno del programa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Año */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 2025"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Año del programa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Código de Cohorte */}
              <FormField
                control={form.control}
                name="cohortCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Cohorte</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 2025-1, 2025-2"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Código identificador de la cohorte
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fechas de Inicio y Fin */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Inicio</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Fecha y hora de inicio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Fin</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Fecha y hora de finalización
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Estado de Publicación */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de Publicación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Estado de visibilidad del programa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-6 pb-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Programa"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
} 