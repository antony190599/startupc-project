import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';
import { getProgramsOrThrow, transformProgramsResponse } from '@/lib/api/programs';
import { createProgramSchema, updateProgramSchema, updateProgramStatusSchema } from '@/lib/zod/schemas';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {

    //Verify the sessions
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const sortBy = searchParams.get('sortBy') as any;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined;
    const search = searchParams.get('search') || undefined;
    const programId = searchParams.get('programId') || undefined;
    const programType = searchParams.get('programType') || undefined;
    const programStatus = searchParams.get('programStatus') || undefined;
    const year = searchParams.get('year') || undefined;
    const cohortCode = searchParams.get('cohortCode') || undefined;
    const status = searchParams.get('status') || undefined;

    // Get programs with the provided parameters
    const result = await getProgramsOrThrow({
      sortBy,
      sortOrder,
      page,
      pageSize,
      search,
      programId,
      programType,
      programStatus,
      year,
      cohortCode,
      status,
    });

    // Transform the response
    const transformedResponse = transformProgramsResponse(result.programs, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    });

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error in programs API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
        { error: 'Access denied. Only admins can create programs.' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createProgramSchema.parse(body);

    // Parse dates if provided
    const programData = {
      ...validatedData,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
    };

    // Create the program
    const program = await prisma.program.create({
      data: programData,
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

    // Create initial status log
    await prisma.programStatusLog.create({
      data: {
        programId: program.id,
        status: program.status || 'draft',
      },
    });

    return NextResponse.json({
      success: true,
      data: program,
      message: 'Program created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/programs:', error);

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
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const { programId, ...updateData } = body;

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const validatedData = updateProgramSchema.parse(updateData);

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id: programId },
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
      where: { id: programId },
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

    return NextResponse.json({
      success: true,
      data: updatedProgram,
      message: 'Program updated successfully',
    });

  } catch (error) {
    console.error('Error in PUT /api/programs:', error);

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

export async function PATCH(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const { programId, ...statusData } = body;

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Validate status update data
    const validatedData = updateProgramStatusSchema.parse(statusData);

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id: programId },
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
        where: { id: programId },
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
          programId: programId,
          status: validatedData.status,
        },
      });

      return updatedProgram;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `Program status updated to ${validatedData.status} successfully`,
    });

  } catch (error) {
    console.error('Error in PATCH /api/programs:', error);

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