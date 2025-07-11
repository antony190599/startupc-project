"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransformedUser } from "@/lib/api/users/transformer-users"
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
import { MoreHorizontal, Eye, Edit, Trash2, User, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const columns: ColumnDef<TransformedUser>[] = [
  {
    accessorKey: "firstname",
    header: "Usuario",
    cell: ({ row }) => {
      const user = row.original
      const firstname = user.firstname
      const lastname = user.lastname
      const email = user.email
      const image = user.image
      const role = user.role

      const fullName = [firstname, lastname]
        .filter(Boolean)
        .join(" ")

      const getInitials = (name: string) => {
        return name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      }

      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image || ""} alt={fullName} />
            <AvatarFallback>
              {fullName ? getInitials(fullName) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium">
              {fullName || "Sin nombre"}
            </div>
            <div className="text-sm text-muted-foreground">
              {email || "Sin email"}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string

      const getRoleLabel = (role: string) => {
        switch (role) {
          case "entrepreneur":
            return "Emprendedor"
          case "admin":
            return "Administrador"
          case "mentor":
            return "Mentor"
          default:
            return role || "Sin rol"
        }
      }

      const getRoleVariant = (role: string) => {
        switch (role) {
          case "entrepreneur":
            return "roleEntrepreneur"
          case "admin":
            return "roleAdmin"
          default:
            return "outline"
        }
      }

      return (
        <Badge variant={getRoleVariant(role)}>
          {getRoleLabel(role)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "teamMember",
    header: "Información Académica",
    cell: ({ row }) => {
      const teamMember = row.getValue("teamMember") as TransformedUser["teamMember"]

      if (!teamMember) {
        return <span className="text-muted-foreground">No es miembro de equipo</span>
      }

      return (
        <div className="space-y-1">
          <div className="font-medium">
            {teamMember.firstName} {teamMember.lastName}
          </div>
          <div className="text-sm text-muted-foreground">
            {teamMember.universityDisplay || teamMember.otherUniversity || "Sin universidad"}
          </div>
          {teamMember.career && (
            <div className="text-xs text-muted-foreground">
              {teamMember.career}
            </div>
          )}
        </div>
      )
    },
  },
  {
    id: "status",
    header: "Estado",
    cell: ({ row }) => {
      const user = row.original
      const lockedAt = user.lockedAt
      const invalidLoginAttempts = user.invalidLoginAttempts

      if (lockedAt) {
        return (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-destructive" />
            <Badge variant="destructive">Bloqueado</Badge>
          </div>
        )
      }

      if (invalidLoginAttempts > 0) {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {invalidLoginAttempts} intentos fallidos
            </Badge>
          </div>
        )
      }

      return (
        <Badge variant="default">Activo</Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Registro",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date
      
      return (
        <div className="text-sm">
          {new Date(createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original
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
                // Navigate to user detail
                router.push(`/users/${user.id}`)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                // Navigate to edit user
                router.push(`/users/${user.id}/edit`)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                // Handle delete user
                console.log("Delete user:", user.id)
              }}
              className="text-destructive"
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
