import Moment from "moment";
import MomentRange from "moment-range";
import PocketBase from "pocketbase";
import { WalletSchemas } from "shared";

import { WithPB } from "@typescript/pocketbase_interfaces";

export const getAllAssets = (
  pb: PocketBase,
): Promise<WithPB<WalletSchemas.IAssetAggregated>[]> =>
  pb
    .collection("wallet__assets_aggregated")
    .getFullList<WithPB<WalletSchemas.IAssetAggregated>>({
      sort: "name",
    });

// @ts-ignore
const moment = MomentRange.extendMoment(Moment);

export const getAssetAccumulatedBalance = async (
  pb: PocketBase,
  assetId: string,
): Promise<Record<string, number>> => {
  const asset = await pb
    .collection("wallet__assets")
    .getOne<Pick<WithPB<WalletSchemas.IAsset>, "starting_balance">>(assetId, {
      fields: "starting_balance",
    });

  const allTransactions = await pb
    .collection("wallet__transactions")
    .getFullList<
      Pick<WithPB<WalletSchemas.ITransaction>, "amount" | "date" | "side">
    >({
      filter: `asset = '${assetId}'`,
      sort: "-date",
      fields: "amount,date,side",
    });

  let currentBalance = asset.starting_balance;
  const accumulatedBalance: Record<string, number> = {};

  const allDateInBetween = moment
    .range(moment(allTransactions[allTransactions.length - 1].date), moment())
    .by("day");

  for (const date of allDateInBetween) {
    const dateStr = date.format("YYYY-MM-DD");
    accumulatedBalance[dateStr] = parseFloat(currentBalance.toFixed(2));

    const transactionsOnDate = allTransactions.filter((t) =>
      moment(t.date).isSame(date, "day"),
    );

    for (const transaction of transactionsOnDate) {
      if (transaction.side) {
        if (transaction.side === "debit") {
          currentBalance += transaction.amount;
        } else if (transaction.side === "credit") {
          currentBalance -= transaction.amount;
        }
      }
    }
  }

  return accumulatedBalance;
};

export const createAsset = (
  pb: PocketBase,
  data: Pick<WalletSchemas.IAsset, "name" | "icon" | "starting_balance">,
): Promise<WithPB<WalletSchemas.IAsset>> =>
  pb.collection("wallet__assets").create<WithPB<WalletSchemas.IAsset>>(data);

export const updateAsset = (
  pb: PocketBase,
  id: string,
  data: Pick<WalletSchemas.IAsset, "name" | "icon" | "starting_balance">,
): Promise<WithPB<WalletSchemas.IAsset>> =>
  pb
    .collection("wallet__assets")
    .update<WithPB<WalletSchemas.IAsset>>(id, data);

export const deleteAsset = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("wallet__assets").delete(id);
};
