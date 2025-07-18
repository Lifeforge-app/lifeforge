import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { MomentVaultCollectionsSchemas } from "../collections";

const Transcription = {
  /**
   * @route       POST /:id
   * @description Transcribe an existing audio entry
   */
  transcribeExisted: {
    params: z.object({
      id: z.string(),
    }),
    response: z.string(),
  },

  /**
   * @route       POST /
   * @description Transcribe a new audio file
   */
  transcribeNew: {
    response: z.string(),
  },
};

const Entries = {
  /**
   * @route       GET /
   * @description Get all moment vault entries
   */
  getEntries: {
    query: z.object({
      page: z
        .string()
        .optional()
        .transform((val) => parseInt(val ?? "1", 10) || 1),
    }),
    response: z.object({
      items: z.array(SchemaWithPB(MomentVaultCollectionsSchemas.Entry)),
      page: z.number(),
      perPage: z.number(),
      totalItems: z.number(),
      totalPages: z.number(),
    }),
  },

  /**
   * @route       POST /
   * @description Create a new moment vault entry
   */
  createEntry: {
    body: z.object({
      type: z.enum(["text", "audio", "photos"]),
      content: z.string().optional(),
      transcription: z.string().optional(),
    }),
    response: SchemaWithPB(MomentVaultCollectionsSchemas.Entry),
  },

  /**
   * @route       PATCH /:id
   * @description Update a moment vault entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      content: z.string(),
    }),
    response: SchemaWithPB(MomentVaultCollectionsSchemas.Entry),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a moment vault entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

type ITranscription = z.infer<typeof Transcription>;
type IEntries = z.infer<typeof Entries>;

export type { ITranscription, IEntries };
export { Transcription, Entries };
