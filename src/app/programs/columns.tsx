"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransformedProgram } from "@/lib/api/programs/transformer-programs"
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
import { MoreHorizontal, Eye, Edit, Trash2, Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<TransformedProgram>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const description = row.original.description
      
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {name || "-"}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {description || "-"}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "programType",
    header: "Tipo de Programa",
    cell: ({ row }) => {
      const programType = row.getValue("programType") as string
      
      const getProgramTypeLabel = (type: string) => {
        switch (type) {
          case "inqubalab":
            return "Inqubalab"
          case "idea-feedback":
            return "Idea Feedback"
          case "aceleracion":
            return "Aceleración"
          default:
            return type || "No especificado"
        }
      }

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
          {getProgramTypeLabel(programType)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "startDate",
    header: "Período",
    cell: ({ row }) => {
      const startDate = row.original.startDate
      const endDate = row.original.endDate
      
      const formatDate = (date: Date | null) => {
        if (!date) return "-"
        return format(new Date(date), "dd/MM/yyyy", { locale: es })
      }

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">Inicio:</span>
            <span>{formatDate(startDate)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">Fin:</span>
            <span>{formatDate(endDate)}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "cohortCode",
    header: "Cohorte & Año",
    cell: ({ row }) => {
      const cohortCode = row.original.cohortCode
      const year = row.original.year
      
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">
              {cohortCode || "Sin código"}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {year || "Sin año"}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      const getStatusLabel = (status: string) => {
        switch (status) {
          case "draft":
            return "Borrador"
          case "published":
            return "Publicado"
          case "inactive":
            return "Inactivo"
          default:
            return status || "Sin estado"
        }
      }

      const getStatusVariant = (status: string) => {
        switch (status) {
          case "draft":
            return "outline"
          case "published":
            return "default"
          case "inactive":
            return "secondary"
          default:
            return "outline"
        }
      }

      return (
        <Badge variant={getStatusVariant(status)}>
          {getStatusLabel(status)}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const program = row.original
      const router = useRouter()

      return (
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
                // Navigate to program detail
                router.push(`/programs/${program.id}`)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                // Navigate to edit program
                router.push(`/programs/${program.id}/edit`)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                // Handle delete program
                if (confirm('¿Estás seguro de que quieres eliminar este programa?')) {
                  // Delete logic here
                  console.log('Delete program:', program.id)
                }
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
