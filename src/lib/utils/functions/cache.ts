import { UserProps } from "@/lib/types";
import { redis } from "@/lib/upstash";

export const setOnboardingStep = async (user: UserProps, step: string) => {
    await redis.set(`onboarding-step:${user.id}`, step);
}

export const setProgramJoinIntent = async (user: UserProps, programId: string) => {
    await redis.set(`program-join-attempt:${user.id}`, programId);
}

export const setUniqueSessionId = async (sessionId: string, nextUrl: string) => {
    await redis.set(`unique-session-id:${sessionId}`, nextUrl);
}

export const setAIApplicationAnalysis = async (applicationId: string, analysis: string) => {
    await redis.set(`ai-application-analysis:${applicationId}`, analysis);
}

export const getAIApplicationAnalysis = async (applicationId: string) => {
    const analysis = await redis.get(`ai-application-analysis:${applicationId}`);
    return analysis;
}