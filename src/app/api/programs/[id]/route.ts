import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';
import { getProgramsOrThrow, transformProgramDetail } from '@/lib/api/programs';
import { updateProgramSchema, updateProgramStatusSchema } from '@/lib/zod/schemas';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the specific program
    const result = await getProgramsOrThrow({
      programId: id,
    });

    if (result.programs.length === 0) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    const program = result.programs[0];
    const transformedProgram = transformProgramDetail(program);

    return NextResponse.json(transformedProgram);
  } catch (error) {
    console.error('Error in program detail API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session
    const session = await getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Only admins can update programs.' },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateProgramSchema.parse(body);

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Parse dates if provided
    const programUpdateData = {
      ...validatedData,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : validatedData.startDate,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : validatedData.endDate,
      updatedAt: new Date(),
    };

    // Update the program
    const updatedProgram = await prisma.program.update({
      where: { id },
      data: programUpdateData,
      include: {
        programStatusLogs: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Transform the updated program
    const transformedProgram = transformProgramDetail(updatedProgram);

    return NextResponse.json({
      success: true,
      data: transformedProgram,
      message: 'Program updated successfully',
    });

  } catch (error) {
    console.error('Error in PUT /api/programs/[id]:', error);

    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('Required') || error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session
    const session = await getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Only admins can update program status.' },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateProgramStatusSchema.parse(body);

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Use transaction to update program status and create status log
    const result = await prisma.$transaction(async (tx) => {
      // Update the program status
      const updatedProgram = await tx.program.update({
        where: { id },
        data: {
          status: validatedData.status,
          updatedAt: new Date(),
        },
        include: {
          programStatusLogs: {
            select: {
              id: true,
              status: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      // Create status log entry
      await tx.programStatusLog.create({
        data: {
          programId: id,
          status: validatedData.status,
        },
      });

      return updatedProgram;
    });

    // Transform the updated program
    const transformedProgram = transformProgramDetail(result);

    return NextResponse.json({
      success: true,
      data: transformedProgram,
      message: `Program status updated to ${validatedData.status} successfully`,
    });

  } catch (error) {
    console.error('Error in PATCH /api/programs/[id]:', error);

    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('Required') || error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update program status' },
      { status: 500 }
    );
  }
} 