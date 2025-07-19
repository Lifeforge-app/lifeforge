/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: wallet
 * Generated at: 2025-07-19T14:24:04.969Z
 * Contains: wallet__assets, wallet__ledgers, wallet__categories, wallet__transactions, wallet__categories_aggregated, wallet__assets_aggregated, wallet__ledgers_aggregated, wallet__transaction_types_aggregated
 */

import { z } from "zod/v4";

const Asset = z.object({
  name: z.string(),
  icon: z.string(),
  starting_balance: z.number(),
});

const Ledger = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

const Category = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  type: z.enum(["income","expenses",""]),
});

const Transaction = z.object({
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

const CategoryAggregated = z.object({
  type: z.enum(["income","expenses",""]),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  amount: z.number(),
});

const AssetAggregated = z.object({
  name: z.string(),
  icon: z.string(),
  starting_balance: z.number(),
  amount: z.number(),
  balance: z.any(),
});

const LedgerAggregated = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  amount: z.number(),
});

const TransactionTypeAggregated = z.object({
  name: z.enum(["income","expenses","transfer",""]),
  amount: z.number(),
  accumulate: z.any(),
});

type IAsset = z.infer<typeof Asset>;
type ILedger = z.infer<typeof Ledger>;
type ICategory = z.infer<typeof Category>;
type ITransaction = z.infer<typeof Transaction>;
type ICategoryAggregated = z.infer<typeof CategoryAggregated>;
type IAssetAggregated = z.infer<typeof AssetAggregated>;
type ILedgerAggregated = z.infer<typeof LedgerAggregated>;
type ITransactionTypeAggregated = z.infer<typeof TransactionTypeAggregated>;

export {
  Asset,
  Ledger,
  Category,
  Transaction,
  CategoryAggregated,
  AssetAggregated,
  LedgerAggregated,
  TransactionTypeAggregated,
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

const WalletIncomeExpensesSummarySchema = z.object({
  totalIncome: z.number(),
  totalExpenses: z.number(),
  monthlyIncome: z.number(),
  monthlyExpenses: z.number()
})

const WalletReceiptScanResultSchema = z.object({
  date: z.string(),
  particulars: z.string(),
  type: z.string(),
  amount: z.number()
})

type IWalletIncomeExpensesSummary = z.infer<
  typeof WalletIncomeExpensesSummarySchema
>
type IWalletReceiptScanResult = z.infer<typeof WalletReceiptScanResultSchema>

export { WalletIncomeExpensesSummarySchema, WalletReceiptScanResultSchema }

export type { IWalletIncomeExpensesSummary, IWalletReceiptScanResult }
