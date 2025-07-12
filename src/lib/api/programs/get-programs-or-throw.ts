import { prisma } from '@/lib/db';
import { ProgramQueryResult } from './transformer-programs';

export interface GetProgramsParams {
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'programType' | 'programStatus' | 'year' | 'cohortCode' | 'startDate' | 'endDate' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  search?: string;
  programId?: string;
  programType?: string;
  programStatus?: string;
  year?: string;
  cohortCode?: string;
  status?: string;
}

export interface GetProgramsResult {
  programs: ProgramQueryResult[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getProgramsOrThrow(params: GetProgramsParams = {}): Promise<GetProgramsResult> {
  const {
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
    search,
    programId,
    programType,
    programStatus,
    year,
    cohortCode,
    status,
  } = params;

  // Validate pagination parameters
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(100, Math.max(1, pageSize));

  // Build where clause
  const where: any = {};

  // Filter by specific program ID
  if (programId) {
    where.id = programId;
  }

  // Filter by program type
  if (programType) {
    where.programType = programType;
  }

  // Filter by program status
  if (programStatus) {
    where.programStatus = programStatus;
  }

  // Filter by year
  if (year) {
    where.year = year;
  }

  // Filter by cohort code
  if (cohortCode) {
    where.cohortCode = cohortCode;
  }

  // Filter by status
  if (status) {
    where.status = status;
  }

  // Search functionality
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { programType: { contains: search, mode: 'insensitive' } },
      { programStatus: { contains: search, mode: 'insensitive' } },
      { year: { contains: search, mode: 'insensitive' } },
      { cohortCode: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Build order by clause
  const orderBy: any = {};

  if (sortBy) {
    orderBy[sortBy] = sortOrder;
  }

  console.log("sortBy", sortBy);
  console.log("sortOrder", sortOrder);

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

    console.log("programs", programs);

    return {
      programs,
      total,
      page: validPage,
      pageSize: validPageSize,
    };
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw new Error('Failed to fetch programs');
  }
}
