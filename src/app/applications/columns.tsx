"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransformedApplication } from "@/lib/api/applications/transformer-applications"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Settings } from "lucide-react"
import { ProjectStatus } from "@/lib/enum"
import { useRouter } from "next/navigation"
import { StatusUpdateModal } from "./status-update-modal"
import { useState } from "react"
import { useSession } from "next-auth/react"

export const columns: ColumnDef<TransformedApplication>[] = [
  {
    accessorKey: "projectName",
    header: "Nombre del Proyecto",
    cell: ({ row }) => {
      const projectName = row.getValue("projectName") as string
      return (
        <div className="font-medium">
          {projectName || "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "programId",
    header: "Programa",
    cell: ({ row }) => {
      const application = row.original
      const programName = application.programName as string
      const programType = application.programType as string
      
      const getProgramTypeVariant = (type: string) => {
        switch (type) {
          case "inqubalab":
            return "default"
          case "idea-feedback":
            return "secondary"
          case "aceleracion":
            return "destructive"
          default:
            return "outline"
        }
      }

      return (
        <Badge variant={getProgramTypeVariant(programType)}>
          {programName || "No especificado"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "primaryUser",
    header: "Usuario Principal",
    cell: ({ row }) => {
      const primaryUser = row.getValue("primaryUser") as {
        firstname: string | null
        lastname: string | null
        email: string | null
      } | null

      if (!primaryUser) {
        return <span className="text-muted-foreground">No asignado</span>
      }

      const fullName = [primaryUser.firstname, primaryUser.lastname]
        .filter(Boolean)
        .join(" ")

      return (
        <div className="space-y-1">
          <div className="font-medium">
            {fullName || "-"}
          </div>
          <div className="text-sm text-muted-foreground">
            {primaryUser.email || "-"}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "projectStatus",
    header: "Estado",
    cell: ({ row }) => {
      const application = row.original
      const status = row.getValue("projectStatus") as string
      const isCompleted = application.isCompleted as boolean

      const getStatusLabel = (status: string) => {
        switch (status) {
          case ProjectStatus.CREATED:
            return "Creado"
          case ProjectStatus.PENDING_INTAKE:
            return "Pendiente de revisión"
          case ProjectStatus.APPROVED:
            return "Aprobado"
          case ProjectStatus.REJECTED:
            return "Rechazado"
          case ProjectStatus.TECHNICAL_REVIEW:
            return "En Revisión Técnica"
          case ProjectStatus.ACCEPTED:
            return "Aceptado"
          default:
            return status || "Sin estado"
        }
      }

      const getStatusVariant = (status: string, completed: boolean) => {
        
        switch (status) {
          case ProjectStatus.CREATED:
            return "outline"
          case ProjectStatus.PENDING_INTAKE:
            return "warning"
          case ProjectStatus.APPROVED:
            return "success"
          case ProjectStatus.REJECTED:
            return "error"
          case ProjectStatus.TECHNICAL_REVIEW:
            return "info"
          case ProjectStatus.ACCEPTED:
            return "success"
          default:
            return "outline"
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(status, isCompleted)}>
            {getStatusLabel(status)}
          </Badge>
          {
            /*
            {isCompleted && (
            <Badge variant="default" className="text-xs">
              Completado
            </Badge>
          )}
            */
          }
          
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const application = row.original
      const router = useRouter()
      const { data: session } = useSession()
      const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

      const handleStatusUpdate = () => {
        // This will trigger a refresh of the data
        // You might want to add a callback prop to refresh the table data
        window.location.reload()
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  // Navigate to application detail
                  router.push(`/applications/${application.id}`)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              {application.projectStatus !== ProjectStatus.CREATED && session?.user?.role === 'admin' && (
                <DropdownMenuItem 
                  onClick={() => setIsStatusModalOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Actualizar estado
                </DropdownMenuItem>
              )}
              {/* <DropdownMenuItem 
                onClick={() => {
                  // Navigate to edit application
                  router.push(`/applications/${application.id}/edit`)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  // Handle delete application
                  if (confirm('¿Estás seguro de que quieres eliminar esta aplicación?')) {
                    // Delete logic here
                    console.log('Delete application:', application.id)
                  }
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>

          <StatusUpdateModal
            application={application}
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            onStatusUpdate={handleStatusUpdate}
          />
        </>
      )
    },
  },
] 