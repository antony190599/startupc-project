import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get project application
    const projectApplication = await prisma.projectApplication.findFirst({
      where: { 
        users: { some: { id: user.id } }
      },
      include: { teamMembers: true }
    })

    if (!projectApplication) {
      return NextResponse.json({
        success: true,
        data: {
          hasApplication: false,
          currentStep: null,
          completedSteps: [],
          progress: 0,
          isComplete: false
        }
      })
    }

    // Define all steps
    const allSteps = [
      'program-selection',
      'general-data',
      'impact-origin',
      'presentation',
      'team',
      'preferences',
      'consent'
    ]

    // Check which steps are completed
    const completedSteps: string[] = []
    
    if (projectApplication.programType) {
      completedSteps.push('program-selection')
    }
    
    if (projectApplication.projectName && projectApplication.category && projectApplication.industry && projectApplication.description) {
      completedSteps.push('general-data')
    }
    
    if (projectApplication.opportunityValue && projectApplication.stage && projectApplication.projectOrigin && 
        projectApplication.problem && projectApplication.customerProfile && projectApplication.impact) {
      completedSteps.push('impact-origin')
    }
    
    if (projectApplication.specificSupport) {
      completedSteps.push('presentation')
    }
    
    if (projectApplication.source && projectApplication.teamMembers && projectApplication.teamMembers.length > 0) {
      completedSteps.push('team')
    }
    
    if (projectApplication.favoriteSport && projectApplication.favoriteHobby && projectApplication.favoriteMovieGenre) {
      completedSteps.push('preferences')
    }
    
    if (projectApplication.privacyConsent) {
      completedSteps.push('consent')
    }

    const progress = Math.round((completedSteps.length / allSteps.length) * 100)
    const isComplete = completedSteps.length === allSteps.length

    return NextResponse.json({
      success: true,
      data: {
        hasApplication: true,
        currentStep: projectApplication.onboardingStep,
        completedSteps,
        progress,
        isComplete,
        applicationId: projectApplication.id,
        createdAt: projectApplication.createdAt,
        updatedAt: projectApplication.updatedAt
      }
    })

  } catch (error) {
    console.error('Onboarding status API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 