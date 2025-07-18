import PocketBase from "pocketbase";
import { WalletSchemas } from "shared/types";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllLedgers = (
  pb: PocketBase,
): Promise<WithPB<WalletSchemas.ILedger>[]> =>
  pb
    .collection("wallet__ledgers_aggregated")
    .getFullList<WithPB<WalletSchemas.ILedger>>({
      sort: "name",
    });

export const createLedger = (
  pb: PocketBase,
  data: Omit<WalletSchemas.ILedger, "amount">,
): Promise<WithPB<WalletSchemas.ILedger>> =>
  pb.collection("wallet__ledgers").create<WithPB<WalletSchemas.ILedger>>(data);

export const updateLedger = (
  pb: PocketBase,
  id: string,
  data: Omit<WalletSchemas.ILedger, "amount">,
): Promise<WithPB<WalletSchemas.ILedger>> =>
  pb
    .collection("wallet__ledgers")
    .update<WithPB<WalletSchemas.ILedger>>(id, data);

export const deleteLedger = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("wallet__ledgers").delete(id);
};
