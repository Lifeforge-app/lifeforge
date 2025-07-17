import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IBlogEntry } from "../schema";

export const getAllEntries = (pb: PocketBase): Promise<WithPB<IBlogEntry>[]> =>
  pb.collection("blog__entries").getFullList<WithPB<IBlogEntry>>();
