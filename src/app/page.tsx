"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Program {
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
  applicationCount?: number;
  isCompleted?: boolean;
}

interface ProgramsResponse {
  rows: Program[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

function ProgramsList({ handleJoinProgram }: { handleJoinProgram: (programId: string) => void }) {
  const { data: session } = useSession();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningProgram, setJoiningProgram] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/programs/published');
        if (!response.ok) {
          throw new Error('Failed to fetch programs');
        }
        const data: ProgramsResponse = await response.json();
        console.log("data", data)
        setPrograms(data.rows);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgramTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'inqubalab': 'Inqbalab',
      'idea-feedback': 'Feedback de Ideas',
      'aceleracion': 'Aceleración'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar los programas: {error}</p>
      </div>
    );
  }

  console.log("programs", programs)

  if (programs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay programas disponibles en este momento.</p>
      </div>
    );
  }

  const handleJoinClick = async (programId: string) => {
    setJoiningProgram(programId);
    try {
      await handleJoinProgram(programId);
    } catch {
      setJoiningProgram(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {programs.map((program) => {
        const isApplied = program.applicationCount === 1;
        const isCompleted = program.isCompleted;
        console.log(joiningProgram)
        console.log(program)
        const isJoining = joiningProgram === program.id;
        return (
          <Card
            key={program.id}
            className={`hover:shadow-lg transition-shadow relative ${isApplied && isCompleted ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {isApplied && isCompleted && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 rounded-lg">
                <span className="text-green-600 font-bold text-lg">Ya postulaste</span>
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{program.name}</CardTitle>
                <Badge variant="secondary">
                  {getProgramTypeLabel(program.programType)}
                </Badge>
              </div>
              <CardDescription>
                {program.cohortCode && (
                  <span className="block text-sm text-muted-foreground">
                    Cohorte: {program.cohortCode}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {program.description}
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                {program.startDate && (
                  <div>
                    <strong>Inicio:</strong> {formatDate(program.startDate)}
                  </div>
                )}
                {program.endDate && (
                  <div>
                    <strong>Fin:</strong> {formatDate(program.endDate)}
                  </div>
                )}
                {program.year && (
                  <div>
                    <strong>Año:</strong> {program.year}
                  </div>
                )}
              </div>
              {!isApplied && (
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleJoinClick(program.id)}
                  disabled={session?.user?.role === 'admin' || isJoining}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uniendo...
                    </>
                  ) : (
                    session?.user?.role === 'admin' ? 'No disponible para administradores' : 'Unirme'
                  )}
                </Button>
              )}
              {isApplied && !isCompleted && (
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleJoinClick(program.id)}
                  disabled={session?.user?.role === 'admin' || isJoining}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    session?.user?.role === 'admin' ? 'No disponible para administradores' : 'Continuar'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleJoinProgram = async (programId: string) => {
    router.push(`/onboarding/${programId}`);
  }

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
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

      {/* Programs Section */}
      <div className="mt-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Programas Disponibles</h2>
          <p className="text-lg text-muted-foreground">
            Explora nuestros programas activos y encuentra el que mejor se adapte a tu proyecto
          </p>
        </div>
        <ProgramsList handleJoinProgram={handleJoinProgram} />
      </div>
    </div>
  );
}