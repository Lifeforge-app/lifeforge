import { z } from "zod/v4";

const ImageGeneration = {
  /**
   * @route       GET /key-exists
   * @description Check if OpenAI API key exists
   */
  checkKey: {
    response: z.boolean(),
  },

  /**
   * @route       POST /generate-image
   * @description Generate an image from a text prompt
   */
  generateImage: {
    body: z.object({
      prompt: z.string().min(1, "Prompt cannot be empty"),
    }),
    response: z.string(),
  },
};

type IImageGeneration = z.infer<typeof ImageGeneration>;

export type { IImageGeneration };
export { ImageGeneration };
