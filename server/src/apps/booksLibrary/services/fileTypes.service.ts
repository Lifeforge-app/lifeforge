import PocketBase from "pocketbase";
import { BooksLibrarySchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllFileTypes = (
  pb: PocketBase,
): Promise<WithPB<BooksLibrarySchemas.IFileType>[]> =>
  pb
    .collection("books_library__file_types_aggregated")
    .getFullList<WithPB<BooksLibrarySchemas.IFileType>>({
      sort: "name",
    });
