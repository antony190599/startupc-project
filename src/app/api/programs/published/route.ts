import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { transformProgramsResponse } from '@/lib/api/programs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const sortBy = searchParams.get('sortBy') as any;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined;
    const search = searchParams.get('search') || undefined;
    const programType = searchParams.get('programType') || undefined;
    const year = searchParams.get('year') || undefined;
    const cohortCode = searchParams.get('cohortCode') || undefined;

    // Validate pagination parameters
    const validPage = Math.max(1, page || 1);
    const validPageSize = Math.min(100, Math.max(1, pageSize || 10));

    // Get current date
    const currentDate = new Date();

    // Build where clause for published programs within date range
    const where: any = {
      status: 'published', // Only published programs
      AND: [
        {
          OR: [
            { startDate: null }, // Programs without start date
            { startDate: { lte: currentDate } }, // Programs that have started
          ],
        },
        {
          OR: [
            { endDate: null }, // Programs without end date
            { endDate: { gte: currentDate } }, // Programs that haven't ended
          ],
        },
      ],
    };

    // Filter by program type
    if (programType) {
      where.programType = programType;
    }

    // Filter by year
    if (year) {
      where.year = year;
    }

    // Filter by cohort code
    if (cohortCode) {
      where.cohortCode = cohortCode;
    }

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { programType: { contains: search, mode: 'insensitive' } },
        { year: { contains: search, mode: 'insensitive' } },
        { cohortCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    try {
      // Get total count for pagination
      const total = await prisma.program.count({ where });

      // Get programs with pagination
      const programs = await prisma.program.findMany({
        where,
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
        orderBy,
        skip: (validPage - 1) * validPageSize,
        take: validPageSize,
      });

      // Transform the response
      const transformedResponse = transformProgramsResponse(programs, {
        page: validPage,
        pageSize: validPageSize,
        total,
      });

      return NextResponse.json(transformedResponse);
    } catch (error) {
      console.error('Error fetching published programs:', error);
      throw new Error('Failed to fetch published programs');
    }
  } catch (error) {
    console.error('Error in published programs API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch published programs' },
      { status: 500 }
    );
  }
}
