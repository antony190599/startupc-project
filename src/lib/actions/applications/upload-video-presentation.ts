import { storage } from "@/lib/storage";
import { nanoid } from "@/lib/utils/functions/nanoid";
import { authActionClient } from "../safe-action";
import z from "@/lib/zod";

const R2_URL = process.env.R2_URL || "";

const schema = z.object({
});


export const uploadLanderImageAction = authActionClient
  .schema(schema)
  .action(async ({ ctx: any }) => {

    try {
      const key = `videos/video_${nanoid(7)}`;

      const signedUrl = await storage.getSignedUrl(key);

      return {
        key,
        signedUrl,
        destinationUrl: `${R2_URL}/${key}`,
      };
    } catch (e) {
      throw new Error("Failed to get signed URL for upload.");
    }
  });