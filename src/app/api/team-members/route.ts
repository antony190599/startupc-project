import { NextRequest, NextResponse } from 'next/server';
import { getTeamMembersOrThrow, getAllTeamMembersForUser, GetTeamMembersParams } from '@/lib/api/team-members/get-team-members-or-throw';
import { getSession } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is an entrepreneur
    if (session.user.role !== 'entrepreneur') {
      return NextResponse.json(
        { error: 'Forbidden: Only entrepreneurs can access team members' },
        { status: 403 }
      );
    }

    // Get the user ID from the session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    
    // Check if all parameter is present to get all team members without pagination
    const getAll = searchParams.get('all') === 'true';
    
    if (getAll) {
      // Get all team members for the user without pagination
      const teamMembers = await getAllTeamMembersForUser(userId);
      
      return NextResponse.json({
        teamMembers,
        total: teamMembers.length,
        message: 'All team members retrieved successfully'
      });
    }

    // Parse pagination and filtering parameters
    const params: GetTeamMembersParams = {
      userId,
      sortBy: searchParams.get('sortBy') as GetTeamMembersParams['sortBy'] || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '10'),
      search: searchParams.get('search') || undefined,
      projectApplicationId: searchParams.get('projectApplicationId') || undefined,
      university: searchParams.get('university') || undefined,
    };

    // Validate sortBy parameter
    const validSortByFields = ['createdAt', 'updatedAt', 'firstName', 'lastName', 'contactEmail'];
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

    // Get team members with pagination
    const result = await getTeamMembersOrThrow(params);

    return NextResponse.json({
      teamMembers: result.teamMembers,
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
        hasNext: result.page < Math.ceil(result.total / result.pageSize),
        hasPrev: result.page > 1,
      }
    });
  } catch (error) {
    console.error('Error in team members API:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'User ID is required') {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message === 'Failed to fetch team members') {
        return NextResponse.json(
          { error: 'Failed to fetch team members' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
