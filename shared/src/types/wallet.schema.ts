/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: wallet
 * Generated at: 2025-07-17T08:55:29.695Z
 * Contains: wallet__assets, wallet__ledgers, wallet__categories, wallet__transactions, wallet__categories_aggregated, wallet__assets_aggregated, wallet__ledgers_aggregated, wallet__transaction_types_aggregated
 */

import { z } from "zod/v4";
const AssetSchema = z.object({
  name: z.string(),
  icon: z.string(),
  starting_balance: z.number(),
});

const LedgerSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

const CategorySchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  type: z.enum(["income","expenses",""]),
});

const TransactionSchema = z.object({
  type: z.enum(["income","expenses","transfer",""]),
  side: z.enum(["debit","credit",""]),
  particulars: z.string(),
  amount: z.number(),
  date: z.string(),
  location_name: z.string(),
  location_coords: z.object({ lat: z.number(), lon: z.number() }),
  category: z.string(),
  asset: z.string(),
  ledger: z.string(),
  receipt: z.string(),
});

const CategoryAggregatedSchema = z.object({
  type: z.enum(["income","expenses",""]),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  amount: z.number(),
});

const AssetAggregatedSchema = z.object({
  name: z.string(),
  icon: z.string(),
  starting_balance: z.number(),
  amount: z.number(),
  balance: z.any(),
});

const LedgerAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  amount: z.number(),
});

const TransactionTypeAggregatedSchema = z.object({
  name: z.enum(["income","expenses","transfer",""]),
  amount: z.number(),
  accumulate: z.any(),
});

type IAsset = z.infer<typeof AssetSchema>;
type ILedger = z.infer<typeof LedgerSchema>;
type ICategory = z.infer<typeof CategorySchema>;
type ITransaction = z.infer<typeof TransactionSchema>;
type ICategoryAggregated = z.infer<typeof CategoryAggregatedSchema>;
type IAssetAggregated = z.infer<typeof AssetAggregatedSchema>;
type ILedgerAggregated = z.infer<typeof LedgerAggregatedSchema>;
type ITransactionTypeAggregated = z.infer<typeof TransactionTypeAggregatedSchema>;

export {
  AssetSchema,
  LedgerSchema,
  CategorySchema,
  TransactionSchema,
  CategoryAggregatedSchema,
  AssetAggregatedSchema,
  LedgerAggregatedSchema,
  TransactionTypeAggregatedSchema,
};

export type {
  IAsset,
  ILedger,
  ICategory,
  ITransaction,
  ICategoryAggregated,
  IAssetAggregated,
  ILedgerAggregated,
  ITransactionTypeAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
