"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProjectStatus } from "@/lib/enum"
import { TransformedApplication } from "@/lib/api/applications/transformer-applications"

interface StatusUpdateModalProps {
  application: TransformedApplication | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: () => void
}

const statusOptions = [
  //{ value: ProjectStatus.CREATED, label: "Creado", description: "Aplicación recién creada" },
  //{ value: ProjectStatus.PENDING_INTAKE, label: "Pendiente de revisión", description: "En espera de revisión inicial" },
  { value: ProjectStatus.TECHNICAL_REVIEW, label: "En Revisión Técnica", description: "Siendo evaluado por el equipo técnico" },
  { value: ProjectStatus.APPROVED, label: "Aprobado", description: "Aplicación aprobada para continuar" },
  { value: ProjectStatus.ACCEPTED, label: "Aceptado", description: "Aceptado en el programa" },
  { value: ProjectStatus.REJECTED, label: "Rechazado", description: "Aplicación rechazada" },
]

export function StatusUpdateModal({
  application,
  isOpen,
  onClose,
  onStatusUpdate
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStatusUpdate = async () => {
    if (!application || !selectedStatus) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/applications/${application.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: selectedStatus,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update status')
      }

      // Success
      onStatusUpdate()
      onClose()
      setSelectedStatus("")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setSelectedStatus("")
      setError(null)
      onClose()
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case ProjectStatus.TECHNICAL_REVIEW:
        return "secondary"
      case ProjectStatus.APPROVED:
        return "default"
      case ProjectStatus.ACCEPTED:
        return "default"
      case ProjectStatus.REJECTED:
        return "destructive"
      default:
        return "outline"
    }
  }

  if (!application) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Estado del Proyecto</DialogTitle>
          <DialogDescription>
            Cambia el estado de la aplicación "{application.projectName || 'Sin nombre'}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado Actual</label>
            <div>
              <Badge variant={getStatusVariant(application.projectStatus || "")}>
                {statusOptions.find(option => option.value === application.projectStatus)?.label || "Sin estado"}
              </Badge>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nuevo Estado</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un nuevo estado" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleStatusUpdate}
            disabled={!selectedStatus || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              'Actualizar Estado'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 