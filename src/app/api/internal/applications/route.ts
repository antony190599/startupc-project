import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProjectStatus } from '@/lib/enum';

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.X_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { programId, userId, ...projectData } = body;

    if (!programId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    const program = await prisma.program.findUnique({
      where: {
        id: programId,
      },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    //VERIFICAR SI EXISTE UNA APLICACION PARA EL USUARIO EN EL PROGRAMA
    const applicationFound = await prisma.projectApplication.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        programId,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (applicationFound) {
      return NextResponse.json({ success: true, message: 'Application already exists' }, { status: 200 });
    }

    // Create the project application
    const application = await prisma.projectApplication.create({
      data: {
        programId,
        isCompleted: false,
        onboardingStep: 'program-selection',
        projectStatus: ProjectStatus.CREATED,
        programType: program?.programType,
        users: {
          connect: { id: userId },
        },
      },
      include: {
        users: true,
        program: true,
      },
    });

    // Create Team Member
    await prisma.teamMember.create({
      data: {
        firstName: user?.firstname as string,
        lastName: user?.lastname as string,
        contactEmail: user?.email as string,
        projectApplicationId: application.id,
        userId: userId,
      },
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    console.error('Error creating project application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


