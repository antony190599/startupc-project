import { ProjectApplication, User, TeamMember, ProjectStatusLog } from '@prisma/client';
import { 
  industries, 
  stages, 
  projectOrigins, 
  sources, 
  sports, 
  hobbies, 
  movieGenres, 
  programTypes,
  steps,
  parentCategories,
  universities
} from '@/lib/enum';

export interface ApplicationWithRelations extends ProjectApplication {
  teamMembers: TeamMember[];
}

export interface ApplicationQueryResult extends ProjectApplication {
  program: {
    name: string;
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
  programName: string | null;
  programId: string | null;
}

export interface TransformedApplicationDetail extends TransformedApplication {
  // Additional fields for detailed view
  description: string | null;
  website: string | null;
  ruc: string | null;
  foundingYear: string | null;
  opportunityValue: string | null;
  projectOrigin: string | null;
  problem: string | null;
  customerProfile: string | null;
  impact: string | null;
  videoUrl: string | null;
  videoFileName: string | null;
  specificSupport: string | null;
  howMet: string | null;
  source: string | null;
  favoriteSport: string | null;
  favoriteHobby: string | null;
  favoriteMovieGenre: string | null;
  privacyConsent: boolean | null;
  onboardingStep: string | null;
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

// Helper functions to get display values from enums
const getProgramTypeDisplay = (programType: string | null) => {
  if (!programType) return null;
  const program = programTypes.find(p => p.id === programType);
  return program ? program.title : programType;
};

const getIndustryDisplay = (industry: string | null) => {
  if (!industry) return null;
  return industries[industry as keyof typeof industries] || industry;
};

const getParentCategoryDisplay = (parentCategory: string | null) => {
  if (!parentCategory) return null;
  return parentCategories[parentCategory as keyof typeof parentCategories] || parentCategory;
};

const getUniversityDisplay = (university: string | null) => {
  if (!university) return null;
  return universities[university as keyof typeof universities] || university;
};

const getStageDisplay = (stage: string | null) => {
  if (!stage) return null;
  return stages[stage as keyof typeof stages] || stage;
};

const getProjectOriginDisplay = (origin: string | null) => {
  if (!origin) return null;
  return projectOrigins[origin as keyof typeof projectOrigins] || origin;
};

const getSourceDisplay = (source: string | null) => {
  if (!source) return null;
  return sources[source as keyof typeof sources] || source;
};

const getSportDisplay = (sport: string | null) => {
  if (!sport) return null;
  return sports[sport as keyof typeof sports] || sport;
};

const getHobbyDisplay = (hobby: string | null) => {
  if (!hobby) return null;
  return hobbies[hobby as keyof typeof hobbies] || hobby;
};

const getMovieGenreDisplay = (genre: string | null) => {
  if (!genre) return null;
  return movieGenres[genre as keyof typeof movieGenres] || genre;
};

const getStepDisplay = (stepId: string | null) => {
  if (!stepId) return null;
  const step = steps.find(s => s.id === stepId);
  return step ? step.title : stepId;
};

export function transformApplication(application: ApplicationQueryResult): TransformedApplication {
  const primaryUser = application.teamMembers[0] || null;
  
  return {
    id: application.id,
    projectName: application.projectName,
    programType: getProgramTypeDisplay(application.programType),
    category: getParentCategoryDisplay(application.category),
    industry: getIndustryDisplay(application.industry),
    stage: getStageDisplay(application.stage),
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
      university: getUniversityDisplay(member.university),
      career: member.career,
      studentCode: member.studentCode,
      phone: member.phone,
      universityEmail: member.universityEmail,
      linkedin: member.linkedin,
      otherUniversity: member.otherUniversity,
      dni: member.dni,
    })),
    programName: application.program?.name || null,
    programId: application.programId || null,
  };
}

export function transformApplicationDetail(application: ApplicationQueryResult): TransformedApplicationDetail {
  const baseApplication = transformApplication(application);
  
  return {
    ...baseApplication,
    description: application.description,
    website: application.website,
    ruc: application.ruc,
    foundingYear: application.foundingYear,
    opportunityValue: application.opportunityValue,
    projectOrigin: getProjectOriginDisplay(application.projectOrigin),
    problem: application.problem,
    customerProfile: application.customerProfile,
    impact: application.impact,
    videoUrl: application.videoUrl,
    videoFileName: application.videoFileName,
    specificSupport: application.specificSupport,
    howMet: application.howMet,
    source: getSourceDisplay(application.source),
    favoriteSport: getSportDisplay(application.favoriteSport),
    favoriteHobby: getHobbyDisplay(application.favoriteHobby),
    favoriteMovieGenre: getMovieGenreDisplay(application.favoriteMovieGenre),
    privacyConsent: application.privacyConsent,
    onboardingStep: getStepDisplay(application.onboardingStep),
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
