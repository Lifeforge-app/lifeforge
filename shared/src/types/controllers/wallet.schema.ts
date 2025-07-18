import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { WalletCollectionsSchemas } from "../collections";
import {
  WalletIncomeExpensesSummarySchema,
  WalletReceiptScanResultSchema,
} from "../collections/wallet.schema";

const Transactions = {
  /**
   * @route       GET /
   * @description Get all wallet transactions
   */
  getAllTransactions: {
    response: z.array(SchemaWithPB(WalletCollectionsSchemas.Transaction)),
  },

  /**
   * @route       POST /
   * @description Create a new wallet transaction
   */
  createTransaction: {
    body: z.object({
      particulars: z.string(),
      date: z.string(),
      amount: z.string().transform((val) => parseFloat(val)),
      category: z.string().optional(),
      location_name: z.string().optional(),
      location_coords: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return undefined;
          try {
            const coords = JSON.parse(val);
            return {
              lon: parseFloat(coords.longitude),
              lat: parseFloat(coords.latitude),
            };
          } catch {
            return {
              lon: 0,
              lat: 0,
            };
          }
        }),
      asset: z.string().optional(),
      ledger: z.string().optional(),
      type: z.enum(["income", "expenses", "transfer"]),
      fromAsset: z.string().optional(),
      toAsset: z.string().optional(),
    }),
    response: z.array(SchemaWithPB(WalletCollectionsSchemas.Transaction)),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing wallet transaction
   */
  updateTransaction: {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      particulars: z.string(),
      date: z.string(),
      amount: z.string().transform((val) => parseFloat(val)),
      category: z.string().optional(),
      location_name: z.string().optional(),
      location_coords: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return undefined;
          try {
            const coords = JSON.parse(val);
            return {
              lon: parseFloat(coords.longitude),
              lat: parseFloat(coords.latitude),
            };
          } catch {
            return {
              lon: 0,
              lat: 0,
            };
          }
        }),
      asset: z.string(),
      ledger: z.string().optional(),
      type: z.enum(["income", "expenses", "transfer"]),
      removeReceipt: z
        .string()
        .optional()
        .default("false")
        .transform((val) => val === "true"),
    }),
    response: SchemaWithPB(WalletCollectionsSchemas.Transaction),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a wallet transaction
   */
  deleteTransaction: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       POST /scan-receipt
   * @description Scan receipt to extract transaction data
   */
  scanReceipt: {
    response: WalletReceiptScanResultSchema,
  },
};

const Assets = {
  /**
   * @route       GET /
   * @description Get all wallet assets
   */
  getAllAssets: {
    response: z.array(SchemaWithPB(WalletCollectionsSchemas.AssetAggregated)),
  },

  /**
   * @route       POST /
   * @description Create a new wallet asset
   */
  createAsset: {
    body: WalletCollectionsSchemas.Asset.pick({
      name: true,
      icon: true,
      starting_balance: true,
    }).extend({
      starting_balance: z.string().transform((val) => {
        const balance = parseFloat(val);
        return isNaN(balance) ? 0 : balance;
      }),
    }),
    response: SchemaWithPB(WalletCollectionsSchemas.Asset),
  },

  /**
   * @route       GET /balance/:id
   * @description Get accumulated balance for a wallet asset
   */
  getAssetAccumulatedBalance: {
    params: z.object({
      id: z.string(),
    }),
    response: z.record(z.string(), z.number()),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing wallet asset
   */
  updateAsset: {
    params: z.object({
      id: z.string(),
    }),
    body: WalletCollectionsSchemas.Asset.pick({
      name: true,
      icon: true,
      starting_balance: true,
    }).extend({
      starting_balance: z.string().transform((val) => {
        const balance = parseFloat(val);
        return isNaN(balance) ? 0 : balance;
      }),
    }),
    response: SchemaWithPB(WalletCollectionsSchemas.Asset),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a wallet asset
   */
  deleteAsset: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Ledgers = {
  /**
   * @route       GET /
   * @description Get all wallet ledgers
   */
  getAllLedgers: {
    response: z.array(SchemaWithPB(WalletCollectionsSchemas.Ledger)),
  },

  /**
   * @route       POST /
   * @description Create a new wallet ledger
   */
  createLedger: {
    body: WalletCollectionsSchemas.Ledger,
    response: SchemaWithPB(WalletCollectionsSchemas.Ledger),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing wallet ledger
   */
  updateLedger: {
    params: z.object({
      id: z.string(),
    }),
    body: WalletCollectionsSchemas.Ledger,
    response: SchemaWithPB(WalletCollectionsSchemas.Ledger),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a wallet ledger
   */
  deleteLedger: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Utils = {
  /**
   * @route       GET /types-count
   * @description Get wallet transaction types count and accumulation
   */
  getTypesCount: {
    response: z.record(
      z.string(),
      z.object({
        amount: z.number(),
        accumulate: z.number(),
      })
    ),
  },

  /**
   * @route       GET /income-expenses
   * @description Get income and expenses summary for a specific month/year
   */
  getIncomeExpensesSummary: {
    query: z.object({
      year: z.string(),
      month: z.string(),
    }),
    response: WalletIncomeExpensesSummarySchema,
  },

  /**
   * @route       GET /expenses-breakdown
   * @description Get expenses breakdown by category for a specific month/year
   */
  getExpensesBreakdown: {
    query: z.object({
      year: z
        .string()
        .transform((val) => parseInt(val) || new Date().getFullYear()),
      month: z
        .string()
        .transform((val) => parseInt(val) || new Date().getMonth() + 1),
    }),
    response: z.record(
      z.string(),
      z.object({
        amount: z.number(),
        count: z.number(),
        percentage: z.number(),
      })
    ),
  },
};

const Categories = {
  /**
   * @route       GET /
   * @description Get all wallet categories
   */
  getAllCategories: {
    response: z.array(
      SchemaWithPB(WalletCollectionsSchemas.CategoryAggregated)
    ),
  },

  /**
   * @route       POST /
   * @description Create a new wallet category
   */
  createCategory: {
    body: WalletCollectionsSchemas.Category,
    response: SchemaWithPB(WalletCollectionsSchemas.Category),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing wallet category
   */
  updateCategory: {
    params: z.object({
      id: z.string(),
    }),
    body: WalletCollectionsSchemas.Category,
    response: SchemaWithPB(WalletCollectionsSchemas.Category),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a wallet category
   */
  deleteCategory: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

type ITransactions = z.infer<typeof Transactions>;
type IAssets = z.infer<typeof Assets>;
type ILedgers = z.infer<typeof Ledgers>;
type IUtils = z.infer<typeof Utils>;
type ICategories = z.infer<typeof Categories>;

export type { ITransactions, IAssets, ILedgers, IUtils, ICategories };
export { Transactions, Assets, Ledgers, Utils, Categories };
