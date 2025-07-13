import { getUserViaToken, parse } from "@/lib/middleware/utils";
import { NextRequest, NextResponse } from "next/server";
import { getOnboardingStep } from "./utils/get-onboarding-step";
import { setUniqueSessionId } from "../utils/functions/cache";
import { fetcher } from "@/lib/utils/functions/fetcher";


export default async function AppMiddleware(req: NextRequest) {
    const { path, fullPath, searchParamsString } = parse(req);

    const user = await getUserViaToken(req);

    console.log('user', user);
    console.log('path', path);
    console.log('fullPath', fullPath);
    console.log('searchParamsString', searchParamsString);

    //GENERATE COOKIE TO SAVE UNIQUE IDENTIFIER FOR SESSION NEXT JS
    const sessionId = crypto.randomUUID();
    const response = NextResponse.next();

    //VERIFY IF SESSION ID IS ALREADY SET
    const sessionIdCookie = req.cookies.get('uniqueSessionId');
    if (!sessionIdCookie) {
        response.cookies.set('uniqueSessionId', sessionId, {
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
    }

    if (path === '/login') {
        return response;
    }

    if (!user && path.startsWith('/onboarding/')) {

        const sessionIdCookie = req.cookies.get('uniqueSessionId');
        const uniqueSessionId = sessionIdCookie?.value;

        const nextUrl = req.nextUrl.pathname;

        if (uniqueSessionId) {
            await setUniqueSessionId(uniqueSessionId, nextUrl);
        }

        return NextResponse.redirect(new URL('/login?next=' + nextUrl, req.url));
    } else if (!user && path !== '/entrepreneur/signup' && path !== '/') {
        console.log('redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
    } else if (user && path.startsWith('/onboarding/')) {

        const nextUrl = req.nextUrl.pathname;

        const userId = user?.id;
        const programId = path.split('/')[2];

        // VERIFY THE COOKIE TO SAVE THE PROGRAM SAVED
        const programCreatedSuccessful = req.cookies.get(`program-created-successful:${userId}`);

        console.log('programCreatedSuccessful', programCreatedSuccessful);

        if (!programCreatedSuccessful || programCreatedSuccessful.value !== programId) {
            
            try {

                const result = await fetcher(`${process.env.API_INTERNAL_URL}/api/internal/applications`, {
                    method: 'POST',
                    body: JSON.stringify({
                        userId,
                        programId,
                    }),
                    headers: {
                        'x-api-key': process.env.X_API_KEY || '',
                    },
                });
    
                if (result.success) {
                    console.log('program created successful');
                    response.cookies.set(`program-created-successful:${userId}`, programId, {
                        path: '/',
                        httpOnly: false,
                        sameSite: 'lax',
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60 * 24 * 30 // 30 days
                    });
                    return response;
                }
    
                if (result.error) {
                    return response;
                }
    
            } catch (error) {
                console.error('Error creating project application:', error);
                return response;
            }    
        }


        
        return response;
    } else if(user && !['/onboarding'].includes(path)) {

        if (user.role === 'entrepreneur' && await getOnboardingStep(user) !== "completed") {
            // DISABLING THIS FOR NOW
            //return NextResponse.redirect(new URL('/onboarding', req.url));
        }
    } else if (user && path === '/onboarding') {

        if (user.role === 'entrepreneur') {
            //check if the user has a program join intent in the cookie
            const programJoinNextAttempt = req.cookies.get('program-join-next-attempt');

            if (programJoinNextAttempt) {

                //RESPONSE WITH QUERY STRING WITH PROGRAMID
                const redirectURL = new URL(`/onboarding/${programJoinNextAttempt.value}`, req.url);
                const response = NextResponse.redirect(redirectURL);
                response.cookies.delete('program-join-next-attempt');

                return response;
            }
            
        }
        
        if (user.role === 'entrepreneur' && await getOnboardingStep(user) === "completed") {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        if (user.role === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    return response;
}