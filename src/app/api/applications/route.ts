import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';
import { getApplicationsOrThrow } from '@/lib/api/applications/get-applications-or-throw';
import { transformApplicationsResponse } from '@/lib/api/applications/transformer-applications';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Role-based access control
    const userRole = session.user.role;
    const userId = session.user.id;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    
    const sortBy = searchParams.get('sortBy') as any || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || undefined;
    const projectApplicationId = searchParams.get('projectApplicationId') || undefined;
    const programType = searchParams.get('programType') || undefined;
    const category = searchParams.get('category') || undefined;
    const industry = searchParams.get('industry') || undefined;
    const stage = searchParams.get('stage') || undefined;
    const projectStatus = searchParams.get('projectStatus') || undefined;
    const isCompleted = searchParams.get('isCompleted') !== null 
      ? searchParams.get('isCompleted') === 'true'
      : undefined;

    // For entrepreneurs, force the projectApplicationId to their own application
    let effectiveProjectApplicationId = projectApplicationId;
    
    if (userRole === 'entrepreneur') {
      // Get the entrepreneur's application ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { projectApplicationId: true }
      });

      if (!user?.projectApplicationId) {
        // Entrepreneur has no application, return empty result
        return NextResponse.json({
          success: true,
          data: {
            rows: [],
            summary: {
              page: 1,
              pageSize: pageSize,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            }
          }
        });
      }

      // Force the filter to only show their own application
      effectiveProjectApplicationId = user.projectApplicationId;
    }
    // Admins can see all applications, so no additional filtering needed

    // Fetch applications with filters
    const result = await getApplicationsOrThrow({
      sortBy,
      sortOrder,
      page,
      pageSize,
      search,
      projectApplicationId: effectiveProjectApplicationId,
      programType,
      category,
      industry,
      stage,
      projectStatus,
      isCompleted,
    });

    // Transform the response
    const transformedResponse = transformApplicationsResponse(
      result.applications,
      {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
      }
    );

    return NextResponse.json({
      success: true,
      data: transformedResponse
    });
  } catch (error) {
    console.error('Get all applications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 