"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
            <Button asChild>
              <Link href="/api/auth/signout">Cerrar sesión</Link>
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Registrarse</Link>
            </Button>
          </>
        )}
      </div>

      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            {status === "authenticated" 
              ? `¡Bienvenido, ${session?.user?.name || "Usuario"}!`
              : "shadcn/ui Button Component Test"
            }
          </h1>
          <p className="text-muted-foreground">
            {status === "authenticated"
              ? "Has iniciado sesión exitosamente con Next Auth"
              : "Testing different variants and sizes of the Button component"
            }
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Button Variants</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Button Sizes</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🚀</Button>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Interactive Examples</h2>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => alert("Button clicked!")}>
                Click me
              </Button>
              <Button disabled>Disabled</Button>
              <Button asChild>
                <a href="#" className="no-underline">
                  As Link
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Combination Examples</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <Button variant="outline" size="sm">
                Small Outline
              </Button>
              <Button variant="destructive" size="lg">
                Large Destructive
              </Button>
              <Button variant="secondary" size="icon">
                ⚙️
              </Button>
              <Button variant="ghost" size="sm">
                Small Ghost
              </Button>
              <Button variant="link" size="lg">
                Large Link
              </Button>
              <Button variant="default" size="default">
                Default Default
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
