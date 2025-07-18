import PocketBase from "pocketbase";
import { BooksLibraryCollectionsSchemas } from "shared/types/collections";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllFileTypes = (
  pb: PocketBase,
): Promise<WithPB<BooksLibraryCollectionsSchemas.IFileType>[]> =>
  pb
    .collection("books_library__file_types_aggregated")
    .getFullList<WithPB<BooksLibraryCollectionsSchemas.IFileType>>({
      sort: "name",
    });
