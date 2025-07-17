import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IBooksLibraryLanguage } from "../schema";

export const getAllLanguages = (
  pb: PocketBase,
): Promise<WithPB<IBooksLibraryLanguage>[]> =>
  pb
    .collection("books_library__languages_aggregated")
    .getFullList<WithPB<IBooksLibraryLanguage>>();

export const createLanguage = (
  pb: PocketBase,
  languageData: { name: string; icon: string },
): Promise<WithPB<IBooksLibraryLanguage>> =>
  pb
    .collection("books_library__languages")
    .create<WithPB<IBooksLibraryLanguage>>(languageData);

export const updateLanguage = (
  pb: PocketBase,
  id: string,
  languageData: { name: string; icon: string },
): Promise<WithPB<IBooksLibraryLanguage>> =>
  pb
    .collection("books_library__languages")
    .update<WithPB<IBooksLibraryLanguage>>(id, languageData);

export const deleteLanguage = async (pb: PocketBase, id: string) => {
  await pb.collection("books_library__languages").delete(id);
};
