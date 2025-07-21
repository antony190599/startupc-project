import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const [
      totalApplications,
      pendingReview,
      approved,
      rejected,
      thisMonth
    ] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { projectStatus: 'PENDING_INTAKE' } }),
      prisma.application.count({ where: { projectStatus: 'APPROVED' } }),
      prisma.application.count({ where: { projectStatus: 'REJECTED' } }),
      prisma.application.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1))
          }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalApplications,
        pendingReview,
        approved,
        rejected,
        thisMonth
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching stats' },
      { status: 500 }
    );
  }
}