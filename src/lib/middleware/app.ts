import { getUserViaToken, parse } from "@/lib/middleware/utils";
import { NextRequest, NextResponse } from "next/server";
import { getOnboardingStep } from "./utils/get-onboarding-step";


export default async function AppMiddleware(req: NextRequest) {
    const { path, fullPath, searchParamsString } = parse(req);

    const user = await getUserViaToken(req);

    console.log('user', user);
    console.log('path', path);
    console.log('fullPath', fullPath);
    console.log('searchParamsString', searchParamsString);

    if (path === '/login') {
        return NextResponse.next();
    }

    //no tiene user y no es entrepreneur/signup
    if (!user && path !== '/entrepreneur/signup') {
        console.log('redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
    } else if(user && !['/onboarding'].includes(path)) {
        
        if (await getOnboardingStep(user) !== "completed") {
            return NextResponse.redirect(new URL('/onboarding', req.url));
        }
    } else if (user && path === '/onboarding') {
        
        if (await getOnboardingStep(user) === "completed") {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    // Set onboardingCompleted cookie if user has completed onboarding but cookie doesn't exist

    /*
    const onboardingCompletedValue = user?.onboardingCompleted ? 'true' : 'false';
    
    console.log('Setting onboardingCompleted cookie for user:', user?.email);
    const response = NextResponse.next();
    response.cookies.set('onboardingCompleted', onboardingCompletedValue, {
        path: '/',
        httpOnly: false, // Allow client-side access
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    return response;
    */
    return NextResponse.next();
}