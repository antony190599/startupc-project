import { UserProps } from "@/lib/types";
import { redis } from "@/lib/upstash";

export const setOnboardingStep = async (user: UserProps, step: string) => {
    await redis.set(`onboarding-step:${user.id}`, step);
}