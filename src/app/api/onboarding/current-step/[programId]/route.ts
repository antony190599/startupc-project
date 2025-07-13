/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/utils';

export async function GET(request: NextRequest, args: {
  params: Promise<{ programId: string }>;
}) {
  try {
    // Validate session
    const session = await getSession();
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

    const { programId } = await args.params;

    // Get project application
    const projectApplication = await prisma.projectApplication.findFirst({
      where: { 
        users: { some: { id: user.id } },
        programId: programId
      },
      select: {
        id: true,
        onboardingStep: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!projectApplication) {
      return NextResponse.json({
        success: true,
        data: {
          hasApplication: false,
          currentStep: null,
          applicationId: null
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        hasApplication: true,
        currentStep: projectApplication.onboardingStep,
        applicationId: projectApplication.id,
        createdAt: projectApplication.createdAt,
        updatedAt: projectApplication.updatedAt
      }
    })

  } catch (error) {
    console.error('Current step API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 