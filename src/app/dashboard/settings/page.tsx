"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email] = useState(session?.user?.email || "");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Configuración</h1>
      <p className="text-muted-foreground mb-8">
        Administra tu perfil y preferencias de cuenta.
      </p>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Actualiza tu información personal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={email} 
                disabled
                placeholder="tu@email.com" 
              />
              <p className="text-xs text-muted-foreground">
                El email no se puede cambiar.
              </p>
            </div>

            <Button className="mt-4">
              Guardar cambios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contraseña</CardTitle>
            <CardDescription>
              Cambia tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Contraseña actual</Label>
              <Input id="current" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new">Nueva contraseña</Label>
              <Input id="new" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar nueva contraseña</Label>
              <Input id="confirm" type="password" />
            </div>

            <Button className="mt-4">
              Actualizar contraseña
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
