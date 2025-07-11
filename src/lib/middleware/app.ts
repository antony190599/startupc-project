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

        if (user.role === 'entrepreneur' && await getOnboardingStep(user) !== "completed") {
            return NextResponse.redirect(new URL('/onboarding', req.url));
        }
    } else if (user && path === '/onboarding') {
        
        if (user.role === 'entrepreneur' && await getOnboardingStep(user) === "completed") {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        if (user.role === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }
    
    return NextResponse.next();
}