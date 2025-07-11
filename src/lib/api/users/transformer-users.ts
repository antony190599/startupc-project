import { User, Profile, TeamMember } from '@prisma/client';
import { universities } from '@/lib/enum';

export interface UserWithRelations extends User {
  profile: Profile | null;
  teamMember: TeamMember | null;
}

export interface UserQueryResult {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string | null;
  lockedAt: Date | null;
  invalidLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  projectApplicationId: string | null;
  profile: {
    id: string;
    bio: string | null;
    location: string | null;
    website: string | null;
    twitter: string | null;
    github: string | null;
    linkedin: string | null;
    avatar: string | null;
    coverImage: string | null;
  } | null;
  teamMember: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string | null;
    studentCode: string | null;
    career: string | null;
    cycle: string | null;
    phone: string | null;
    universityEmail: string | null;
    contactEmail: string;
    linkedin: string | null;
    university: string | null;
    otherUniversity: string | null;
  } | null;
}

export interface TransformedUser {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string | null;
  lockedAt: Date | null;
  invalidLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  projectApplicationId: string | null;
  profile: {
    id: string;
    bio: string | null;
    location: string | null;
    website: string | null;
    twitter: string | null;
    github: string | null;
    linkedin: string | null;
    avatar: string | null;
    coverImage: string | null;
  } | null;
  teamMember: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string | null;
    studentCode: string | null;
    career: string | null;
    cycle: string | null;
    phone: string | null;
    universityEmail: string | null;
    contactEmail: string;
    linkedin: string | null;
    university: string | null;
    universityDisplay: string | null;
    otherUniversity: string | null;
  } | null;
}

export interface UsersResponse {
  rows: TransformedUser[];
  summary: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Helper function to get university display value
const getUniversityDisplay = (university: string | null): string | null => {
  if (!university) return null;
  return universities[university as keyof typeof universities] || university;
};

export function transformUser(user: UserQueryResult): TransformedUser {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,
    lockedAt: user.lockedAt,
    invalidLoginAttempts: user.invalidLoginAttempts,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    projectApplicationId: user.projectApplicationId,
    profile: user.profile,
    teamMember: user.teamMember ? {
      ...user.teamMember,
      universityDisplay: getUniversityDisplay(user.teamMember.university),
    } : null,
  };
}

export function transformUsersResponse(
  users: UserQueryResult[],
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  }
): UsersResponse {
  const { page, pageSize, total } = pagination;
  const totalPages = Math.ceil(total / pageSize);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    rows: users.map(transformUser),
    summary: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext,
      hasPrev,
    },
  };
} 