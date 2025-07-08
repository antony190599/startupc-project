import { ProjectApplication, User, TeamMember } from '@prisma/client';

export interface ApplicationWithRelations extends ProjectApplication {
  teamMembers: TeamMember[];
}

export interface ApplicationQueryResult extends ProjectApplication {
  teamMembers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    contactEmail: string;
    university: string | null;
    career: string | null;
    studentCode: string | null;
    phone: string | null;
    universityEmail: string | null;
    linkedin: string | null;
    otherUniversity: string | null;
    dni: string | null;
  }>;
}

export interface TransformedApplication {
  id: string;
  projectName: string | null;
  programType: string | null;
  category: string | null;
  industry: string | null;
  stage: string | null;
  projectStatus: string | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  teamSize: number;
  primaryUser: {
    id: string;
    email: string | null;
    firstname: string | null;
    lastname: string | null;
  } | null;
  teamMembers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    contactEmail: string;
    university: string | null;
    career: string | null;
    studentCode: string | null;
    phone: string | null;
    universityEmail: string | null;
    linkedin: string | null;
    otherUniversity: string | null;
    dni: string | null;
  }>;
}

export interface ApplicationsResponse {
  rows: TransformedApplication[];
  summary: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function transformApplication(application: ApplicationQueryResult): TransformedApplication {
  const primaryUser = application.teamMembers[0] || null;
  
  return {
    id: application.id,
    projectName: application.projectName,
    programType: application.programType,
    category: application.category,
    industry: application.industry,
    stage: application.stage,
    projectStatus: application.projectStatus,
    isCompleted: application.isCompleted ?? false,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    completedAt: application.completedAt,
    teamSize: application.teamMembers.length,
    primaryUser: primaryUser ? {
      id: primaryUser.id,
      email: primaryUser.contactEmail,
      firstname: primaryUser.firstName,
      lastname: primaryUser.lastName,
    } : null,
    teamMembers: application.teamMembers.map(member => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      contactEmail: member.contactEmail,
      university: member.university,
      career: member.career,
      studentCode: member.studentCode,
      phone: member.phone,
      universityEmail: member.universityEmail,
      linkedin: member.linkedin,
      otherUniversity: member.otherUniversity,
      dni: member.dni,
    })),
  };
}

export function transformApplicationsResponse(
  applications: ApplicationQueryResult[],
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  }
): ApplicationsResponse {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  
  return {
    rows: applications.map(transformApplication),
    summary: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
}
