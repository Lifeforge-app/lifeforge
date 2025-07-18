import PocketBase from "pocketbase";
import { BlogSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllEntries = (
  pb: PocketBase,
): Promise<WithPB<BlogSchemas.IEntry>[]> =>
  pb.collection("blog__entries").getFullList<WithPB<BlogSchemas.IEntry>>();
