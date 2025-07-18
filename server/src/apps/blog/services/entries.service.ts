import PocketBase from "pocketbase";
import { BlogCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllEntries = (
  pb: PocketBase,
): Promise<WithPB<BlogCollectionsSchemas.IEntry>[]> =>
  pb
    .collection("blog__entries")
    .getFullList<WithPB<BlogCollectionsSchemas.IEntry>>();
