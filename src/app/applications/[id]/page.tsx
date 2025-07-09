import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth/utils';
import { prisma } from '@/lib/db';
import ApplicationDetailClient from './application-detail-client';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationWithRelations } from './types';

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getApplicationData(id: string, userEmail: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, role: true, projectApplicationId: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Role-based access control
    if (user.role === 'entrepreneur' && user.projectApplicationId !== id) {
      throw new Error('Access denied');
    }

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
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        projectStatusLogs: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const session = await getSession();
  
  if (!session?.user?.email) {
    notFound();
  }

  const { id } = await params;

  try {
    const application = await getApplicationData(id, session.user.email);
    
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Suspense fallback={<ApplicationDetailSkeleton />}>
          <ApplicationDetailClient application={application} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error in application detail page:', error);
    notFound();
  }
}

function ApplicationDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
      <Skeleton className="h-96" />
    </div>
  );
} 