/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: wallet
 * Generated at: 2025-07-09T12:50:41.284Z
 * Contains: wallet__assets, wallet__ledgers, wallet__categories, wallet__transactions, wallet__categories_aggregated, wallet__assets_aggregated, wallet__ledgers_aggregated, wallet__transaction_types_aggregated
 */
import { z } from "zod/v4";

const WalletAssetSchema = z.object({
  name: z.string(),
  icon: z.string(),
  starting_balance: z.number(),
});

const WalletLedgerSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

const WalletCategorySchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  type: z.enum(["income", "expenses", ""]),
});

const WalletTransactionSchema = z.object({
  type: z.enum(["income", "expenses", "transfer", ""]),
  side: z.enum(["debit", "credit", ""]),
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

const WalletCategoryAggregatedSchema = z.object({
  type: z.enum(["income", "expenses", ""]),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  amount: z.number(),
});

const WalletAssetAggregatedSchema = z.object({
  name: z.string(),
  icon: z.string(),
  starting_balance: z.number(),
  amount: z.number(),
  balance: z.any(),
});

const WalletLedgerAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  amount: z.number(),
});

const WalletTransactionTypeAggregatedSchema = z.object({
  name: z.enum(["income", "expenses", "transfer", ""]),
  amount: z.number(),
  accumulate: z.any(),
});

type IWalletAsset = z.infer<typeof WalletAssetSchema>;
type IWalletLedger = z.infer<typeof WalletLedgerSchema>;
type IWalletCategory = z.infer<typeof WalletCategorySchema>;
type IWalletTransaction = z.infer<typeof WalletTransactionSchema>;
type IWalletCategoryAggregated = z.infer<typeof WalletCategoryAggregatedSchema>;
type IWalletAssetAggregated = z.infer<typeof WalletAssetAggregatedSchema>;
type IWalletLedgerAggregated = z.infer<typeof WalletLedgerAggregatedSchema>;
type IWalletTransactionTypeAggregated = z.infer<
  typeof WalletTransactionTypeAggregatedSchema
>;

export {
  WalletAssetSchema,
  WalletLedgerSchema,
  WalletCategorySchema,
  WalletTransactionSchema,
  WalletCategoryAggregatedSchema,
  WalletAssetAggregatedSchema,
  WalletLedgerAggregatedSchema,
  WalletTransactionTypeAggregatedSchema,
};

export type {
  IWalletAsset,
  IWalletLedger,
  IWalletCategory,
  IWalletTransaction,
  IWalletCategoryAggregated,
  IWalletAssetAggregated,
  IWalletLedgerAggregated,
  IWalletTransactionTypeAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

const WalletIncomeExpensesSummarySchema = z.object({
  totalIncome: z.number(),
  totalExpenses: z.number(),
  monthlyIncome: z.number(),
  monthlyExpenses: z.number(),
});

const WalletReceiptScanResultSchema = z.object({
  date: z.string(),
  particulars: z.string(),
  type: z.string(),
  amount: z.number(),
});

type IWalletIncomeExpensesSummary = z.infer<
  typeof WalletIncomeExpensesSummarySchema
>;
type IWalletReceiptScanResult = z.infer<typeof WalletReceiptScanResultSchema>;

export { WalletIncomeExpensesSummarySchema, WalletReceiptScanResultSchema };
export type { IWalletIncomeExpensesSummary, IWalletReceiptScanResult };
