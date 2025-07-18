import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { BlogCollectionsCollectionsSchemas } from "../collections";

const Entries = {
  /**
   * @route       GET /
   * @description Get all blog entries
   */
  getAllEntries: {
    response: z.array(SchemaWithPB(BlogCollectionsSchemas.Entry)),
  },
};

type IEntries = z.infer<typeof Entries>;

export type { IEntries };
export { Entries };
