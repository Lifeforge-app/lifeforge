import PocketBase from "pocketbase";
import { BooksLibrarySchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllLanguages = (
  pb: PocketBase,
): Promise<WithPB<BooksLibrarySchemas.ILanguage>[]> =>
  pb
    .collection("books_library__languages_aggregated")
    .getFullList<WithPB<BooksLibrarySchemas.ILanguage>>();

export const createLanguage = (
  pb: PocketBase,
  languageData: { name: string; icon: string },
): Promise<WithPB<BooksLibrarySchemas.ILanguage>> =>
  pb
    .collection("books_library__languages")
    .create<WithPB<BooksLibrarySchemas.ILanguage>>(languageData);

export const updateLanguage = (
  pb: PocketBase,
  id: string,
  languageData: { name: string; icon: string },
): Promise<WithPB<BooksLibrarySchemas.ILanguage>> =>
  pb
    .collection("books_library__languages")
    .update<WithPB<BooksLibrarySchemas.ILanguage>>(id, languageData);

export const deleteLanguage = async (pb: PocketBase, id: string) => {
  await pb.collection("books_library__languages").delete(id);
};
