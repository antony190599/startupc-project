import { NextRequest, NextResponse } from 'next/server';
import { getUsersOrThrow, GetUsersParams } from '@/lib/api/users/get-users-or-throw';
import { transformUsersResponse } from '@/lib/api/users/transformer-users';
import { getSession } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    
    const params: GetUsersParams = {
      sortBy: searchParams.get('sortBy') as GetUsersParams['sortBy'] || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '10'),
      search: searchParams.get('search') || undefined,
      projectApplicationId: searchParams.get('projectApplicationId') || undefined,
      role: searchParams.get('role') || undefined,
    };

    // Validate sortBy parameter
    const validSortByFields = ['createdAt', 'updatedAt', 'firstname', 'lastname', 'email', 'role'];
    if (params.sortBy && !validSortByFields.includes(params.sortBy)) {
      return NextResponse.json(
        { error: `Invalid sortBy parameter. Must be one of: ${validSortByFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate sortOrder parameter
    if (params.sortOrder && !['asc', 'desc'].includes(params.sortOrder)) {
      return NextResponse.json(
        { error: 'Invalid sortOrder parameter. Must be "asc" or "desc"' },
        { status: 400 }
      );
    }

    // Validate pagination parameters
    if (params.page && (isNaN(params.page) || params.page < 1)) {
      return NextResponse.json(
        { error: 'Invalid page parameter. Must be a positive integer' },
        { status: 400 }
      );
    }

    if (params.pageSize && (isNaN(params.pageSize) || params.pageSize < 1 || params.pageSize > 100)) {
      return NextResponse.json(
        { error: 'Invalid pageSize parameter. Must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Get users with pagination
    const result = await getUsersOrThrow(params);

    // Transform the response to include university display values and remove sensitive data
    const transformedResult = transformUsersResponse(result.users, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    });

    return NextResponse.json(transformedResult);
  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
