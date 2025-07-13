import { prisma } from '@/lib/db';
import { UserQueryResult } from './transformer-users';

export interface GetUsersParams {
  sortBy?: 'createdAt' | 'updatedAt' | 'firstname' | 'lastname' | 'email' | 'role';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  search?: string;
  projectApplicationId?: string;
  role?: string;
}

export interface GetUsersResult {
  users: UserQueryResult[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getUsersOrThrow(params: GetUsersParams = {}): Promise<GetUsersResult> {
  const {
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
    search,
    projectApplicationId,
    role,
  } = params;

  // Validate pagination parameters
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(100, Math.max(1, pageSize));

  // Build where clause
  const where: any = {};

  // Filter by project application ID
  if (projectApplicationId) {
    where.projectApplicationId = projectApplicationId;
  }

  // Filter by role
  if (role) {
    where.role = role;
  }

  // Search functionality
  if (search) {
    where.OR = [
      { firstname: { contains: search, mode: 'insensitive' } },
      { lastname: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { bio: { contains: search, mode: 'insensitive' } } },
      { profile: { location: { contains: search, mode: 'insensitive' } } },
      { teamMember: { firstName: { contains: search, mode: 'insensitive' } } },
      { teamMember: { lastName: { contains: search, mode: 'insensitive' } } },
      { teamMember: { contactEmail: { contains: search, mode: 'insensitive' } } },
      { teamMember: { universityEmail: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Build order by clause
  const orderBy: any = {};

  if (sortBy) {
    orderBy[sortBy] = sortOrder;
  }

  try {
    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        lockedAt: true,
        invalidLoginAttempts: true,
        createdAt: true,
        updatedAt: true,
        projectApplications: true,
        profile: {
          select: {
            id: true,
            bio: true,
            location: true,
            website: true,
            twitter: true,
            github: true,
            linkedin: true,
            avatar: true,
            coverImage: true,
          },
        },
        teamMember: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dni: true,
            studentCode: true,
            career: true,
            cycle: true,
            phone: true,
            universityEmail: true,
            contactEmail: true,
            linkedin: true,
            university: true,
            otherUniversity: true,
          },
        },
      },
      orderBy,
      skip: (validPage - 1) * validPageSize,
      take: validPageSize,
    });

    return {
      users: users.map(user => ({
        ...user,
        projectApplications: user.projectApplications.map(application => application.id),
      })),
      total,
      page: validPage,
      pageSize: validPageSize,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}
