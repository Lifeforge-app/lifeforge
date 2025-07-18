import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { BlogCollectionsSchemas } from "../collections";
import type { InferApiESchemaDynamic } from "../utils/inferSchema";

const Entries = {
  /**
   * @route       GET /
   * @description Get all blog entries
   */
  getAllEntries: {
    response: z.array(SchemaWithPB(BlogCollectionsSchemas.Entry)),
  },
};

type IEntries = InferApiESchemaDynamic<typeof Entries>;

export type { IEntries };

export { Entries };
