/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db'
import * as z from 'zod'

// Step-specific validation schemas
const stepSchemas = {
  'program-selection': z.object({
    programType: z.string().min(1, "Program type is required"),
  }),
  
  'general-data': z.object({
    projectName: z.string().min(1, "Project name is required"),
    website: z.string().min(1, "Website is required"),
    category: z.string().min(1, "Category is required"),
    industry: z.string().min(1, "Industry is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    ruc: z.string().optional(),
    foundingYear: z.string().optional(),
  }),
  
  'impact-origin': z.object({
    opportunityValue: z.string().min(10, "Opportunity value must be at least 10 characters"),
    stage: z.string().min(1, "Stage is required"),
    projectOrigin: z.string().min(1, "Project origin is required"),
    problem: z.string().min(10, "Problem must be at least 10 characters"),
    customerProfile: z.string().min(10, "Customer profile must be at least 10 characters"),
    impact: z.string().min(10, "Impact must be at least 10 characters"),
  }),
  
  'presentation': z.object({
    videoUrl: z.string().optional(),
    videoFileName: z.string().optional(),
    specificSupport: z.string().min(10, "Specific support must be at least 10 characters"),
  }),
  
  'team': z.object({
    howMet: z.string().optional(),
    source: z.string().min(1, "Source is required"),
    teamMembers: z.array(z.object({
      firstName: z.string().min(1, "Full name is required"),
      lastName: z.string().min(1, "Last name is required"),
      dni: z.string().min(8, "DNI must be at least 8 characters"),
      studentCode: z.string().optional().nullable(),
      career: z.string().min(1, "Career is required"),
      cycle: z.string().optional().nullable(),
      phone: z.string().min(9, "Phone must be at least 9 characters"),
      universityEmail: z.string().email("Must be a valid email").optional().nullable().or(z.literal("")),
      contactEmail: z.string().email("Must be a valid email"),
      linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      university: z.string().min(1, "University is required"),
      otherUniversity: z.string().optional().nullable(),
    })).min(1, "At least one team member is required"),
  }).refine((data) => {
    // Custom validation for howMet - only required if 2+ team members
    if (data.teamMembers.length >= 2) {
      if (!data.howMet || data.howMet.trim().length < 10) {
        return false;
      }
    }
    return true;
  }, {
    message: "Debe explicar cómo se conocieron (mínimo 10 caracteres) cuando hay 2 o más integrantes",
    path: ["howMet"]
  }).refine((data) => {
    // Custom validation for Laureate university fields
    const laureateUniversities = ["upc", "upn", "cibertec"];
    
    for (let i = 0; i < data.teamMembers.length; i++) {
      const member = data.teamMembers[i];
      const isLaureateUniversity = laureateUniversities.includes(member.university);
      
      if (isLaureateUniversity) {
        // Validate student code
        if (!member.studentCode || member.studentCode.trim() === '') {
          return false;
        }
        
        // Validate cycle
        if (!member.cycle || member.cycle.trim() === '') {
          return false;
        }
        
        // Validate university email
        if (!member.universityEmail || member.universityEmail.trim() === '') {
          return false;
        }
      }

      // Validate other university name when "otras" is selected
      if (member.university === "otras") {
        if (!member.otherUniversity || member.otherUniversity.trim() === '') {
          return false;
        }
      }
    }
    return true;
  }, {
    message: "Los campos adicionales son requeridos para estudiantes de Laureate o cuando se selecciona 'otras' universidad",
    path: ["teamMembers"]
  }),
  
  'preferences': z.object({
    favoriteSport: z.string().min(1, "Favorite sport is required"),
    favoriteHobby: z.string().min(1, "Favorite hobby is required"),
    favoriteMovieGenre: z.string().min(1, "Favorite movie genre is required"),
  }),
  
  'consent': z.object({
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: "Privacy consent must be accepted"
    }),
  }),
}

const stepMapping = {
  'program-selection': 0,
  'general-data': 1,
  'impact-origin': 2,
  'presentation': 3,
  'team': 4,
  'preferences': 5,
  'consent': 6,
}

export async function POST(
  request: NextRequest,
  args: {
    params: Promise<{ step: string }>;
  }
) {
  try {
    // Validate session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { step } = await args.params

    console.log('step', step) 
    const body = await request.json()

    // Validate step
    if (!stepSchemas[step as keyof typeof stepSchemas]) {
      return NextResponse.json(
        { error: 'Invalid step' },
        { status: 400 }
      )
    }

    // Validate data against step schema
    const schema = stepSchemas[step as keyof typeof stepSchemas]
    const validatedData = schema.parse(body) as any

    // Get or create user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get or create project application
    let projectApplication = await prisma.projectApplication.findFirst({
      where: { 
        users: { some: { id: user.id } }
      },
      include: { teamMembers: true }
    })

    if (!projectApplication) {
      projectApplication = await prisma.projectApplication.create({
        data: {
          users: { connect: { id: user.id } },
          onboardingStep: step,
        },
        include: { teamMembers: true }
      })
    }

    // Update application based on step
    const updateData: any = {
      onboardingStep: step,
    }

    switch (step) {
      case 'program-selection':
        updateData.programType = validatedData.programType
        break
        
      case 'general-data':
        updateData.projectName = validatedData.projectName
        updateData.website = validatedData.website
        updateData.category = validatedData.category
        updateData.industry = validatedData.industry
        updateData.description = validatedData.description
        updateData.ruc = validatedData.ruc
        updateData.foundingYear = validatedData.foundingYear
        break
        
      case 'impact-origin':
        updateData.opportunityValue = validatedData.opportunityValue
        updateData.stage = validatedData.stage
        updateData.projectOrigin = validatedData.projectOrigin
        updateData.problem = validatedData.problem
        updateData.customerProfile = validatedData.customerProfile
        updateData.impact = validatedData.impact
        break
        
      case 'presentation':
        updateData.videoUrl = validatedData.videoUrl
        updateData.videoFileName = validatedData.videoFileName
        updateData.specificSupport = validatedData.specificSupport
        break
        
      case 'team':
        updateData.howMet = validatedData.howMet
        updateData.source = validatedData.source
        
        // Handle team members
        if (validatedData.teamMembers) {
          // Delete existing team members
          await prisma.teamMember.deleteMany({
            where: { projectApplicationId: projectApplication.id }
          })
          
          // Create new team members
          for (const member of validatedData.teamMembers) {
            await prisma.teamMember.create({
              data: {
                ...member,
                projectApplicationId: projectApplication.id,
                userId: user.id,
              }
            })
          }
        }
        break
        
      case 'preferences':
        updateData.favoriteSport = validatedData.favoriteSport
        updateData.favoriteHobby = validatedData.favoriteHobby
        updateData.favoriteMovieGenre = validatedData.favoriteMovieGenre
        break
        
      case 'consent':
        updateData.privacyConsent = validatedData.privacyConsent
        break
    }

    // Updatethe next Step
    // Get the current step number from the step mapping
    const currentStepNumber = stepMapping[step as keyof typeof stepMapping]
    
    // Calculate the next step number
    const nextStepNumber = currentStepNumber + 1


    //  Get the next step key from stepMapping
    const nextStepKey = Object.keys(stepMapping)[nextStepNumber]
    
    // Update the onboarding step with the next step number
    if (nextStepKey) {
      updateData.onboardingStep = nextStepKey

      if (step === "consent" && updateData.privacyConsent === true) {
        updateData.onboardingStep = "completed"
      }
    }
    
    
    // Update the application
    const updatedApplication = await prisma.projectApplication.update({
      where: { id: projectApplication.id },
      data: updateData,
      include: { teamMembers: true }
    })

    console.log(`Updated onboarding step to: ${step} for user: ${user.email}`)

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      step: step
    })

  } catch (error) {
    console.error('Onboarding API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  args: {
    params: Promise<{ step: string }>;
  }
) {
  try {
    // Validate session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { step } = await args.params;

    // Validate step
    if (!stepSchemas[step as keyof typeof stepSchemas]) {
      return NextResponse.json(
        { error: 'Invalid step' },
        { status: 400 }
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
        data: null,
        step: step
      })
    }

    // Return step-specific data
    let stepData: any = {}

    switch (step) {
      case 'program-selection':
        stepData = {
          programType: projectApplication.programType
        }
        break
        
      case 'general-data':
        stepData = {
          projectName: projectApplication.projectName,
          website: projectApplication.website,
          category: projectApplication.category,
          industry: projectApplication.industry,
          description: projectApplication.description,
          ruc: projectApplication.ruc,
          foundingYear: projectApplication.foundingYear,
        }
        break
        
      case 'impact-origin':
        stepData = {
          opportunityValue: projectApplication.opportunityValue,
          stage: projectApplication.stage,
          projectOrigin: projectApplication.projectOrigin,
          problem: projectApplication.problem,
          customerProfile: projectApplication.customerProfile,
          impact: projectApplication.impact,
        }
        break
        
      case 'presentation':
        stepData = {
          videoUrl: projectApplication.videoUrl,
          videoFileName: projectApplication.videoFileName,
          specificSupport: projectApplication.specificSupport,
        }
        break
        
      case 'team':
        stepData = {
          howMet: projectApplication.howMet,
          source: projectApplication.source,
          teamMembers: projectApplication.teamMembers,
        }
        break
        
      case 'preferences':
        stepData = {
          favoriteSport: projectApplication.favoriteSport,
          favoriteHobby: projectApplication.favoriteHobby,
          favoriteMovieGenre: projectApplication.favoriteMovieGenre,
        }
        break
        
      case 'consent':
        stepData = {
          privacyConsent: projectApplication.privacyConsent,
        }
        break
    }

    return NextResponse.json({
      success: true,
      data: stepData,
      step: step,
      currentStep: projectApplication.onboardingStep
    })

  } catch (error) {
    console.error('Onboarding GET API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 