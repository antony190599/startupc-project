/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserRole = "admin" | "business";

export interface UserProps {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
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