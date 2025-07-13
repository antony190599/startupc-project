import { prisma } from '@/lib/db';
import { TeamMember, ProjectApplication } from '@prisma/client';

export interface ProjectApplicationSummary {
  id: string;
  projectName: string | null;
  programType: string | null;
  category: string | null;
  industry: string | null;
  stage: string | null;
  projectStatus: string | null;
  isCompleted: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberWithProject extends TeamMember {
  projectApplication: ProjectApplicationSummary;
}

export interface GetTeamMembersParams {
  userId: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'contactEmail';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  search?: string;
  projectApplicationId?: string;
  university?: string;
}

export interface GetTeamMembersResult {
  teamMembers: TeamMemberWithProject[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getTeamMembersOrThrow(params: GetTeamMembersParams): Promise<GetTeamMembersResult> {
  const {
    userId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
    search,
    projectApplicationId,
    university,
  } = params;

  // Validate required parameters
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Validate pagination parameters
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(100, Math.max(1, pageSize));

  // Build where clause
  const where: any = {
    userId: userId,
  };

  // Filter by project application ID
  if (projectApplicationId) {
    where.projectApplicationId = projectApplicationId;
  }

  // Filter by university
  if (university) {
    where.university = university;
  }

  // Search functionality
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { contactEmail: { contains: search, mode: 'insensitive' } },
      { universityEmail: { contains: search, mode: 'insensitive' } },
      { studentCode: { contains: search, mode: 'insensitive' } },
      { career: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Build order by clause
  const orderBy: any = {};

  if (sortBy) {
    orderBy[sortBy] = sortOrder;
  }

  try {
    // Get total count for pagination
    const total = await prisma.teamMember.count({ where });

    // Get team members with pagination
    const teamMembers = await prisma.teamMember.findMany({
      where,
      include: {
        projectApplication: {
          select: {
            id: true,
            projectName: true,
            programType: true,
            category: true,
            industry: true,
            stage: true,
            projectStatus: true,
            isCompleted: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy,
      skip: (validPage - 1) * validPageSize,
      take: validPageSize,
    });

    return {
      teamMembers,
      total,
      page: validPage,
      pageSize: validPageSize,
    };
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw new Error('Failed to fetch team members');
  }
}

// Convenience function to get all team members for a user without pagination
export async function getAllTeamMembersForUser(userId: string): Promise<TeamMemberWithProject[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        userId: userId,
      },
      include: {
        projectApplication: {
          select: {
            id: true,
            projectName: true,
            programType: true,
            category: true,
            industry: true,
            stage: true,
            projectStatus: true,
            isCompleted: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return teamMembers;
  } catch (error) {
    console.error('Error fetching all team members for user:', error);
    throw new Error('Failed to fetch team members');
  }
}
