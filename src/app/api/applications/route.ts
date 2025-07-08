import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';
import { getApplicationsOrThrow } from '@/lib/api/applications/get-applications-or-throw';
import { transformApplicationsResponse } from '@/lib/api/applications/transformer-applications';

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

    // Fetch applications with filters
    const result = await getApplicationsOrThrow({
      sortBy,
      sortOrder,
      page,
      pageSize,
      search,
      projectApplicationId,
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