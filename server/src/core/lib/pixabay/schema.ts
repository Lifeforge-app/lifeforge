import { z } from "zod/v4";

const PixabaySearchResultSchema = z.object({
  total: z.number(),
  hits: z.array(
    z.object({
      id: z.string(),
      thumbnail: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      }),
      imageURL: z.string(),
    }),
  ),
});

type IPixabaySearchResult = z.infer<typeof PixabaySearchResultSchema>;

export { PixabaySearchResultSchema };

export default IPixabaySearchResult;
