import { ProjectApplication, User, TeamMember, ProjectStatusLog } from '@prisma/client';

export interface ApplicationWithRelations extends ProjectApplication {
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
  users: Array<{
    id: string;
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    role: string | null;
    createdAt: Date;
  }>;
  projectStatusLogs: Array<{
    id: string;
    status: string;
    createdAt: Date;
  }>;
}

export interface ApplicationDetailClientProps {
  application: ApplicationWithRelations;
}

export interface ApplicationStepsProps {
  application: ApplicationWithRelations;
} 