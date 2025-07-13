import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { programId } = body;

    // Validate programId
    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Check if user has a valid session
    const session = await getSession();

    if (!session?.user?.email) {
      // No valid session - save programId in cookie for later use
      const response = NextResponse.json({
        success: false,
        hasValidSession: false,
        message: 'No valid session found. Please log in to join the program.',
        redirectTo: '/login'
      }, { status: 401 });

      // Set cookie with program join attempt
      response.cookies.set('program-join-next-attempt', programId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });

      return response;
    }

    // User has valid session
    return NextResponse.json({
      success: true,
      hasValidSession: true,
      message: 'Valid session found',
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role
      },
      programId: programId
    });

  } catch (error) {
    console.error('Error in program verify endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
