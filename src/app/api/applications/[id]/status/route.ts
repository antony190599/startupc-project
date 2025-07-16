import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for status update
const updateStatusSchema = z.object({
  status: z.enum(['created', 'pending_intake', 'technical_review', 'approved', 'accepted', 'rejected']),
});

export async function PATCH(
  request: NextRequest,
  args: {
    params: Promise<{ id: string }>;
  }
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
        { error: 'Access denied. Only admins can update application status.' },
        { status: 403 }
      );
    }

    const { id } = await args.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateStatusSchema.parse(body);

    // Check if application exists
    const existingApplication = await prisma.projectApplication.findUnique({
      where: { id },
      select: { id: true, projectStatus: true }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update the application status
    const updatedApplication = await prisma.projectApplication.update({
      where: { id },
      data: {
        projectStatus: validatedData.status,
        updatedAt: new Date(),
      },
      include: {
        program: {
          select: {
            name: true,
          },
        },
        teamMembers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            contactEmail: true,
            university: true,
            career: true,
            studentCode: true,
            phone: true,
            universityEmail: true,
            linkedin: true,
            otherUniversity: true,
            dni: true,
          },
        },
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        projectStatusLogs: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Create status log entry
    await prisma.projectStatusLog.create({
      data: {
        projectApplicationId: id,
        status: validatedData.status,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedApplication.id,
        projectStatus: updatedApplication.projectStatus,
        updatedAt: updatedApplication.updatedAt,
      },
      message: 'Application status updated successfully',
    });

  } catch (error) {
    console.error('Error in PATCH /api/applications/[id]/status:', error);

    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('Required') || error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
