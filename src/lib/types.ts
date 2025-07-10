/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserRole = "admin" | "entrepreneur";

export interface UserProps {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  onboardingCompleted?: boolean;
  name?: string;
  image?: string;
  role?: UserRole;
}

export interface SessionUser extends UserProps {
  id: string;
  email: string;
  role: UserRole;
}

export interface SessionProps {
  user: SessionUser;
  expires: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type OnboardingStep = 
  | 'program-selection'
  | 'general-data'
  | 'impact-origin'
  | 'presentation'
  | 'team'
  | 'preferences'
  | 'consent';

// Application-related types
export type ApplicationSortBy = 'createdAt' | 'updatedAt' | 'projectName' | 'programType' | 'category' | 'industry' | 'stage' | 'projectStatus' | 'isCompleted';
export type ApplicationSortOrder = 'asc' | 'desc';

export interface ApplicationFilters {
  sortBy?: ApplicationSortBy;
  sortOrder?: ApplicationSortOrder;
  page?: number;
  pageSize?: number;
  search?: string;
  projectApplicationId?: string;
  programType?: string;
  category?: string;
  industry?: string;
  stage?: string;
  projectStatus?: string;
  isCompleted?: boolean;
}