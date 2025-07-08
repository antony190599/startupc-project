import { prisma } from '@/lib/db';
import { ApplicationQueryResult } from './transformer-applications';

export interface GetApplicationByIdParams {
  id: string;
}

export async function getApplicationByIdOrThrow(params: GetApplicationByIdParams): Promise<ApplicationQueryResult> {
  const { id } = params;

  if (!id) {
    throw new Error('Application ID is required');
  }

  try {
    const application = await prisma.projectApplication.findUnique({
      where: { id },
      include: {
        teamMembers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            contactEmail: true,
            university: true,
            career: true,
            studentCode: true,
            phone: true,
            universityEmail: true,
            linkedin: true,
            otherUniversity: true,
            dni: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application as ApplicationQueryResult;
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    if (error instanceof Error && error.message === 'Application not found') {
      throw error;
    }
    throw new Error('Failed to fetch application');
  }
}
