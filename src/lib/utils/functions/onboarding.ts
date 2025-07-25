/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from './fetcher'

export type OnboardingStep = 
  | 'program-selection'
  | 'general-data'
  | 'impact-origin'
  | 'presentation'
  | 'team'
  | 'preferences'
  | 'consent'

export interface OnboardingResponse {
  success: boolean
  data: any
  step: string
  currentStep?: string
}

export interface OnboardingError {
  error: string
  details?: any
}

// Save step data
export async function saveOnboardingStep(
  step: OnboardingStep,
  data: any
): Promise<OnboardingResponse> {
  try {
    const response = await fetcher(`/api/onboarding/${step}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return response
  } catch (error) {
    console.error(`Error saving onboarding step ${step}:`, error)
    throw error
  }
}

// Get step data
export async function getOnboardingStep(
  step: OnboardingStep,
  programId: string
): Promise<OnboardingResponse> {
  try {
    const response = await fetcher(`/api/onboarding/${programId}/${step}`, {
      method: 'GET',
    })

    return response
  } catch (error) {
    console.error(`Error getting onboarding step ${step}:`, error)
    throw error
  }
}

// Get current onboarding progress
export async function getOnboardingProgress(programId: string): Promise<{
  currentStep: string | null
  completedSteps: string[]
}> {
  try {
    const steps: OnboardingStep[] = [
      'program-selection',
      'general-data',
      'impact-origin',
      'presentation',
      'team',
      'preferences',
      'consent'
    ]

    const completedSteps: string[] = []
    let currentStep: string | null = null

    for (const step of steps) {
      try {
        const response = await getOnboardingStep(step, programId)
        if (response.data) {
          completedSteps.push(step)
          if (response.currentStep === step) {
            currentStep = step
          }
        }
      } catch (error) {
        // Step not completed or error occurred
        break
      }
    }

    return {
      currentStep,
      completedSteps
    }
  } catch (error) {
    console.error('Error getting onboarding progress:', error)
    throw error
  }
}

// Check if user has an existing application
export async function hasExistingApplication(programId: string): Promise<boolean> {
  try {
    const response = await getOnboardingStep('program-selection', programId)
    return response.data !== null
  } catch (error) {
    return false
  }
}

// Get onboarding status and progress
export async function getOnboardingStatus(programId: string | undefined = undefined): Promise<{
  hasApplication: boolean
  currentStep: string | null
  completedSteps: string[]
  progress: number
  isComplete: boolean
  applicationId?: string
  programId?: string
  createdAt?: string
  updatedAt?: string
  program?: {
    name: string
    description: string
    type: string
    cohortCode: string
    startDate: string
    endDate: string
    year: string
  }
}[]> {
  try {
    const response = await fetcher(`/api/onboarding/status/${programId ? programId : ''}`, {
      method: 'GET',
    })

    return response.data
  } catch (error) {
    console.error('Error getting onboarding status:', error)
    throw error
  }
}

// Get current onboarding step
export async function getCurrentOnboardingStep(programId: string): Promise<{
  hasApplication: boolean
  currentStep: string | null
  applicationId?: string
  createdAt?: string
  updatedAt?: string
}> {
  try {
    const response = await fetcher(`/api/onboarding/current-step/${programId}`, {
      method: 'GET',
    })

    return response.data
  } catch (error) {
    console.error('Error getting current onboarding step:', error)
    throw error
  }
} 