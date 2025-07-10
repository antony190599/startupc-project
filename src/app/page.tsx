"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-end space-x-4 mb-8">
        {status === "authenticated" ? (
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
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/entrepreneur/signup">Registrarse</Link>
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 mt-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            {status === "authenticated" 
              ? `¡Bienvenido, ${session?.user?.name || "Usuario"}!`
              : "StartupC Project"
            }
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg">
            {status === "authenticated"
              ? "Has iniciado sesión exitosamente. Accede a tu dashboard para gestionar tu proyecto."
              : "Plataforma para emprendedores que buscan impulsar sus proyectos innovadores."
            }
          </p>
        </div>

        {status !== "authenticated" && (
          <div className="flex gap-4 mt-8">
            <Button size="lg" asChild>
              <Link href="/entrepreneur/signup">Comenzar ahora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        )}

        {status === "authenticated" && (
          <Button size="lg" className="mt-6" asChild>
            <Link href="/dashboard">Ir al Dashboard</Link>
          </Button>
        )}
      </div>
    </div>
  );
}