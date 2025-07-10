import { getUserViaToken, parse } from "@/lib/middleware/utils";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/db';


export default async function AppMiddleware(req: NextRequest) {
    const { path, fullPath, searchParamsString } = parse(req);

    const user = await getUserViaToken(req);

    console.log('user', user);
    console.log('path', path);
    console.log('fullPath', fullPath);
    console.log('searchParamsString', searchParamsString);

    //no tiene user y no es entrepreneur/signup
    if (!user && path !== '/entrepreneur/signup') {
        return NextResponse.redirect(new URL('/login', req.url));
    } else if(user && !['/onboarding'].includes(path)) {
        const onboardingCompleted = req.cookies.get('onboardingCompleted');
        console.log('onboardingCompleted', user.onboardingCompleted);
        
        if (onboardingCompleted?.value !== 'true' || user.onboardingCompleted !== true) {
            //return NextResponse.redirect(new URL('/onboarding', req.url));
        }
    } else if (user && path === '/onboarding') {
        const onboardingCompleted = req.cookies.get('onboardingCompleted');
        
        if (onboardingCompleted?.value === 'true' || user.onboardingCompleted === true) {
            //return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    return NextResponse.next();
}