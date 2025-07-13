/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const programId = 'null';

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

    // If programId is null or undefined, return all project applications for the user
    if (!programId || programId === 'null' || programId === 'undefined') {
      const projectApplications = await prisma.projectApplication.findMany({
        where: {
          users: { some: { id: user.id } },
        },
        include: { teamMembers: true },
      });

      // Map each application to the same structure as the single response
      const allSteps = [
        'program-selection',
        'general-data',
        'impact-origin',
        'presentation',
        'team',
        'preferences',
        'consent'
      ];

      const applicationsInfo = projectApplications.map(projectApplication => {
        const completedSteps: string[] = [];
        if (projectApplication.programType) completedSteps.push('program-selection');
        if (projectApplication.projectName && projectApplication.category && projectApplication.industry && projectApplication.description) completedSteps.push('general-data');
        if (projectApplication.opportunityValue && projectApplication.stage && projectApplication.projectOrigin && projectApplication.problem && projectApplication.customerProfile && projectApplication.impact) completedSteps.push('impact-origin');
        if (projectApplication.specificSupport) completedSteps.push('presentation');
        if (projectApplication.source && projectApplication.teamMembers && projectApplication.teamMembers.length > 0) completedSteps.push('team');
        if (projectApplication.favoriteSport && projectApplication.favoriteHobby && projectApplication.favoriteMovieGenre) completedSteps.push('preferences');
        if (projectApplication.privacyConsent) completedSteps.push('consent');
        const progress = Math.round((completedSteps.length / allSteps.length) * 100);
        const isComplete = completedSteps.length === allSteps.length;
        return {
          hasApplication: true,
          currentStep: projectApplication.onboardingStep,
          completedSteps,
          progress,
          isComplete,
          applicationId: projectApplication.id,
          programId: projectApplication.programId,
          createdAt: projectApplication.createdAt,
          updatedAt: projectApplication.updatedAt
        };
      });

      //MERGE WITH PROGRAMS AVAILABLES BUT NOT APPLIED
      const programsAvailable = await prisma.program.findMany({
        where: {
          id: { notIn: projectApplications.map(projectApplication => projectApplication.programId as string) }
        }
      });

      const allApplicationsInfo = [...applicationsInfo, ...programsAvailable.map(program => ({
        
        hasApplication: false,
        currentStep: null,
        completedSteps: [],
        progress: 0,
        isComplete: false,
        applicationId: null,
        createdAt: null,
        updatedAt: null,
        programId: program.id
      }))];

      return NextResponse.json({
        success: true,
        data: allApplicationsInfo
      });
    }

    // Get project application for specific programId
    const projectApplication = await prisma.projectApplication.findFirst({
      where: { 
        users: { some: { id: user.id } },
        programId: programId
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
          isComplete: false,
          programId: programId
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
        programId: programId,
        createdAt: projectApplication.createdAt,
        updatedAt: projectApplication.updatedAt
      }
    });
  } catch (error) {
    console.error('Onboarding status API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 