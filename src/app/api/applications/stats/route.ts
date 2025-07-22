import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {

    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [
      totalApplications,
      pendingReview,
      approved,
      rejected,
      thisMonth
    ] = await Promise.all([
      prisma.projectApplication.count(),
      prisma.projectApplication.count({ where: { projectStatus: 'pending_intake' } }),
      prisma.projectApplication.count({ where: { projectStatus: 'approved' } }),
      prisma.projectApplication.count({ where: { projectStatus: 'rejected' } }),
      prisma.projectApplication.count({
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