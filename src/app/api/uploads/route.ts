import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/utils';
import { storage } from '@/lib/storage';
import { nanoid } from '@/lib/utils/functions/nanoid';

const R2_URL = process.env.R2_URL || "";

export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is an entrepreneur
        if (session.user.role !== 'entrepreneur') {
            return NextResponse.json(
                { error: 'Forbidden: Only entrepreneurs can access team members' },
                { status: 403 }
            );
        }

        // Get the user ID from the session
        const userId = session.user.id;
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID not found in session' },
                { status: 400 }
            );
        }

        const key = `videos/video_${nanoid(7)}`;

        const signedUrl = await storage.getSignedUrl(key);

        return NextResponse.json({
            key,
            signedUrl,
            destinationUrl: `${R2_URL}/${key}`,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
