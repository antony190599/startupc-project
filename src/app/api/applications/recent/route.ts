import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const recentApplications = await prisma.projectApplication.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        users: true
      }
    });

    const formattedApplications = recentApplications.map((app: { 
      id: string;
      projectName: string | null;
      users: Array<{ firstname: string | null; lastname: string | null; }>;
      createdAt: Date;
    }) => ({
      id: app.id,
      name: app.projectName || 'Untitled Project',
      entrepreneur: app.users[0] ? `${app.users[0].firstname || ''} ${app.users[0].lastname || ''}`.trim() : 'Unknown',
      date: app.createdAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedApplications
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching recent applications' },
      { status: 500 }
    );
  }
}