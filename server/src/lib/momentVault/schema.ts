import { z } from "zod/v4";

const momentVaultSchemas = {
  entries: z.object({
    type: z.enum(["text", "audio", "video", "photos", ""]),
    file: z.array(z.string()),
    content: z.string(),
    transcription: z.string(),
    created: z.string(),
    updated: z.string(),
  }),
};

export default momentVaultSchemas;
