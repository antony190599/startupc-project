import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';
import { prisma } from '@/lib/db';
import { sendPrompt } from '@/lib/openai';
import { getAIApplicationAnalysis, setAIApplicationAnalysis } from '@/lib/utils/functions/cache';

export async function POST(req: NextRequest, 
    args: {
        params: Promise<{ id: string }>;
    }
) {
  try {
    // Auth: Only admin
    const session = await getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id: applicationId } = await args.params;

    if (!applicationId) {
      return NextResponse.json({ error: 'ID de aplicación requerido' }, { status: 400 });
    }

    const cachedAnalysis = await getAIApplicationAnalysis(applicationId);

    if (cachedAnalysis) {
      return NextResponse.json({ success: true, ai: cachedAnalysis });
    }

    // Fetch application with all relevant data
    const application = await prisma.projectApplication.findUnique({
      where: { id: applicationId },
      include: {
        teamMembers: true,
        program: true,
        users: true,
        projectStatusLogs: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Aplicación no encontrada' }, { status: 404 });
    }

    // Use the first user as the primary user
    const primaryUser = application.users[0];

    // Build a detailed prompt with all application data
    const prompt = `
        Eres un evaluador automatizado de proyectos de emprendimiento. Recibirás información detallada proporcionada por un postulante que ha llenado un formulario sobre su emprendimiento. Tu tarea es:

        1. Evaluar automáticamente el proyecto en base a la información proporcionada.

        2. Generar una puntuación del proyecto (de 0 a 100).

        3. Clasificar la puntuación en una categoría textual: Excelente (80-100), Bueno (60-79), Regular (40-59), Bajo (0-39).

        4. Dar una breve justificación textual de la evaluación.

        5. Proporcionar recomendaciones específicas para mejorar la aplicación, si las hay.

        La salida debe ser en formato JSON, con la siguiente estructura:

        {
            "evaluacion": {
                "puntuacion": 80,
                "clasificacion": "Excelente",
                "justificacion": "El proyecto tiene un alto potencial debido a una solución bien definida y un modelo de negocio claro."
            },
            "recomendaciones": [
                {
                "titulo": "Descripción del proyecto",
                "mensaje": "Considera expandir la descripción del proyecto para incluir más detalles sobre la solución propuesta."
                },
                {
                "titulo": "Equipo del proyecto",
                "mensaje": "Se recomienda agregar más miembros al equipo para fortalecer la aplicación."
                }
            ]
        }

        A continuación, te proporcionaré una variable con toda la información del formulario rellenado por el postulante:
        ---
        Datos del Proyecto:
        - Nombre: ${application.projectName}
        - Descripción: ${application.description}
        - Categoría: ${application.category}
        - Industria: ${application.industry}
        - Tipo de Programa: ${application.program?.programType}
        - Estado actual: ${application.projectStatus}
        - Fecha de creación: ${application.createdAt}

        Impacto y Origen:
        - Impacto: ${application.impact}
        - Etapa: ${application.stage}
        - Perfil del cliente: ${application.customerProfile}

        Miembros del Equipo:
        ${application.teamMembers.map((tm: any) => `  - ${tm.firstName} ${tm.lastName} (${tm.university || ''}, ${tm.career || ''})`).join('\n')}

        Oportunidad y Problema:
        - Valor de oportunidad: ${application.opportunityValue}
        - Origen del proyecto: ${application.projectOrigin}
        - Declaración del problema: ${application.problem}

        Presentación:
        - Video: ${application.videoUrl || 'No proporcionado'}
        - Requerimientos de apoyo: ${application.specificSupport || 'No especificado'}

        Preferencias:
        - Deportes: ${application.favoriteSport || 'No especificado'}
        - Hobbies: ${application.favoriteHobby || 'No especificado'}
        - Películas: ${application.favoriteMovieGenre || 'No especificado'}

        Consentimiento:
        - Política de privacidad aceptada: ${application.privacyConsent ? 'Sí' : 'No'}

        ---

        Por favor solo devolver el JSON, no agregar ningún comentario adicional.`;

    // Call OpenAI
    const aiResponse = await sendPrompt(prompt);

    setAIApplicationAnalysis(applicationId, aiResponse).then(() => {
      console.log('AI analysis cached');
    }).catch((error: any) => {
      console.error('Error caching AI analysis:', error);
    });

    return NextResponse.json({ success: true, ai: typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse });
  } catch (error: any) {
    console.error('AI analysis error:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
