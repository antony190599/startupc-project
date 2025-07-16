import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';
import { getApplicationByIdOrThrow } from '@/lib/api/applications';
import { transformApplicationDetail } from '@/lib/api/applications/transformer-applications';
import { prisma } from '@/lib/db';

export async function GET(
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

    const { id } = await args.params;

    console.log("id", id);

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Role-based access control
    const userRole = session.user.role;
    const userId = session.user.id;

    if (userRole === 'entrepreneur') {
      // Entrepreneurs can only access their own application
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { projectApplications: true }
      });

      if (!user?.projectApplications || !user.projectApplications.map(application => application.id).includes(id as string)) {
        return NextResponse.json(
          { error: 'Access denied. You can only view your own application.' },
          { status: 403 }
        );
      }
    }
    // Admins can access any application, so no additional check needed

    // Get the application with all related data
    const application = await getApplicationByIdOrThrow({ id });

    // Transform the application data for the response
    const transformedApplication = transformApplicationDetail(application);

    return NextResponse.json({
      success: true,
      data: transformedApplication,
    });

  } catch (error) {
    console.error('Error in GET /api/applications/[id]:', error);

    if (error instanceof Error) {
      if (error.message === 'Application not found') {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'Application ID is required') {
        return NextResponse.json(
          { error: 'Application ID is required' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const { id } = await args.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Role-based access control
    const userRole = session.user.role;
    const userId = session.user.id;

    if (userRole === 'entrepreneur') {
      // Entrepreneurs can only update their own application
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { projectApplications: true }
      });

      if (!user?.projectApplications || !user.projectApplications.map(application => application.id).includes(id as string)) {
        return NextResponse.json(
          { error: 'Access denied. You can only update your own application.' },
          { status: 403 }
        );
      }
    }
    // Admins can update any application, so no additional check needed

    // Parse the request body
    const body = await request.json();

    // Check if application exists
    const existingApplication = await prisma.projectApplication.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update the application
    const updatedApplication = await prisma.projectApplication.update({
      where: { id },
      data: {
        ...body,
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

    // Transform the updated application data
    const transformedApplication = transformApplicationDetail(updatedApplication);

    return NextResponse.json({
      success: true,
      data: transformedApplication,
      message: 'Application updated successfully',
    });

  } catch (error) {
    console.error('Error in PUT /api/applications/[id]:', error);

    if (error instanceof Error) {
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

export async function DELETE(
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

    const { id } = await args.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Role-based access control
    const userRole = session.user.role;
    const userId = session.user.id;

    if (userRole === 'entrepreneur') {
      // Entrepreneurs can only delete their own application
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { projectApplications: true }
      });

      if (!user?.projectApplications || !user.projectApplications.map(application => application.id).includes(id as string)) {
        return NextResponse.json(
          { error: 'Access denied. You can only delete your own application.' },
          { status: 403 }
        );
      }
    }
    // Admins can delete any application, so no additional check needed

    // Check if application exists
    const existingApplication = await prisma.projectApplication.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Delete the application (this will cascade to related records)
    await prisma.projectApplication.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });

  } catch (error) {
    console.error('Error in DELETE /api/applications/[id]:', error);

    if (error instanceof Error) {
      if (error.message.includes('Record to delete does not exist')) {
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
