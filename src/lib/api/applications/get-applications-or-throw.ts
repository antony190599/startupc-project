import { prisma } from '@/lib/db';
import { ApplicationQueryResult } from './transformer-applications';

export interface GetApplicationsParams {
  sortBy?: 'createdAt' | 'updatedAt' | 'projectName' | 'programType' | 'category' | 'industry' | 'stage' | 'projectStatus' | 'isCompleted';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  search?: string;
  projectApplicationIds?: string[];
  programType?: string;
  programId?: string;
  category?: string;
  industry?: string;
  stage?: string;
  projectStatus?: string[];
  isCompleted?: boolean;
}

export interface GetApplicationsResult {
  applications: ApplicationQueryResult[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getApplicationsOrThrow(params: GetApplicationsParams = {}): Promise<GetApplicationsResult> {
  const {
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
    search,
    projectApplicationIds,
    programType,
    programId,
    category,
    industry,
    stage,
    projectStatus,
    isCompleted,
  } = params;

  // Validate pagination parameters
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(100, Math.max(1, pageSize));

  // Build where clause
  const where: any = {};

  // Filter by specific application ID
  if (projectApplicationIds) {
    where.id = {
      in: projectApplicationIds,
    };
  }

  // Filter by program type
  if (programType) {
    where.programType = programType;
  }

  // Filter by program ID
  if (programId) {
    where.programId = programId;
  }

  // Filter by category
  if (category) {
    where.category = category;
  }

  // Filter by industry
  if (industry) {
    where.industry = industry;
  }

  // Filter by stage
  if (stage) {
    where.stage = stage;
  }

  // Filter by project status
  if (projectStatus && projectStatus.length > 0) {
    where.projectStatus = {
      in: projectStatus,
    };
  }

  // Filter by completion status
  if (isCompleted !== undefined) {
    where.isCompleted = isCompleted;
  }

  // Search functionality
  if (search) {
    where.OR = [
      { projectName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { problem: { contains: search, mode: 'insensitive' } },
      { customerProfile: { contains: search, mode: 'insensitive' } },
      { impact: { contains: search, mode: 'insensitive' } },
      { users: { some: { email: { contains: search, mode: 'insensitive' } } } },
      { users: { some: { firstname: { contains: search, mode: 'insensitive' } } } },
      { users: { some: { lastname: { contains: search, mode: 'insensitive' } } } },
      { teamMembers: { some: { firstName: { contains: search, mode: 'insensitive' } } } },
      { teamMembers: { some: { lastName: { contains: search, mode: 'insensitive' } } } },
      { teamMembers: { some: { contactEmail: { contains: search, mode: 'insensitive' } } } },
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
    const total = await prisma.projectApplication.count({ where });


    // Get applications with pagination
    const applications = await prisma.projectApplication.findMany({
      where,
      include: {
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
        program: {
          select: {
            name: true,
          },
        },
      },
      orderBy,
      skip: (validPage - 1) * validPageSize,
      take: validPageSize,
    });

    return {
      applications,
      total,
      page: validPage,
      pageSize: validPageSize,
    };
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw new Error('Failed to fetch applications');
  }
}
