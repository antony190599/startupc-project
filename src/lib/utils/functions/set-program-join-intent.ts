import { UserProps } from "@/lib/types";
import { redis } from "@/lib/upstash";


export const setProgramJoinIntent = async (user: UserProps, programId: string) => {
    await redis.set(`program-join-attempt:${user.id}`, programId);
}