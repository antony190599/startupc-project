import { fetcher } from "@/lib/utils/functions/fetcher";
import { Program } from "./form-schema";

// Step names for onboarding process
export const stepNames = [
  'program-selection',
  'general-data', 
  'impact-origin',
  'presentation',
  'team',
  'preferences',
  'consent'
] as const;

export type OnboardingStep = typeof stepNames[number];

// Get published programs from API
export const getProgramsPublished = async (): Promise<Program[]> => {
  const data = await fetcher("/api/programs/published", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.rows;
};

// Laureate universities that require additional fields
export const laureateUniversities = ["upc", "upn", "cibertec"];

// Check if a university is a Laureate university
export const isLaureateUniversity = (university: string): boolean => {
  return laureateUniversities.includes(university);
};

// Default team member template
export const defaultTeamMember = {
  firstName: "",
  lastName: "",
  dni: "",
  studentCode: "",
  career: "",
  cycle: "",
  phone: "",
  universityEmail: "",
  contactEmail: "",
  linkedin: "",
  university: "",
  otherUniversity: "",
}; 