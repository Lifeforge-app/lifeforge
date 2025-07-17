import PocketBase from "pocketbase";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { IWalletLedger } from "../schema";

export const getAllLedgers = (
  pb: PocketBase,
): Promise<WithPB<IWalletLedger>[]> =>
  pb
    .collection("wallet__ledgers_aggregated")
    .getFullList<WithPB<IWalletLedger>>({
      sort: "name",
    });

export const createLedger = (
  pb: PocketBase,
  data: Omit<IWalletLedger, "amount">,
): Promise<WithPB<IWalletLedger>> =>
  pb.collection("wallet__ledgers").create<WithPB<IWalletLedger>>(data);

export const updateLedger = (
  pb: PocketBase,
  id: string,
  data: Omit<IWalletLedger, "amount">,
): Promise<WithPB<IWalletLedger>> =>
  pb.collection("wallet__ledgers").update<WithPB<IWalletLedger>>(id, data);

export const deleteLedger = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("wallet__ledgers").delete(id);
};
