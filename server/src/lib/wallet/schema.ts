import { z } from "zod/v4";

const walletSchemas = {
  assets: z.object({
    name: z.string(),
    icon: z.string(),
    starting_balance: z.number(),
  }),
  ledgers: z.object({
    name: z.string(),
    icon: z.string(),
    color: z.string(),
  }),
  categories: z.object({
    name: z.string(),
    icon: z.string(),
    color: z.string(),
    type: z.enum(["income", "expenses"]),
  }),
  transactions: z.object({
    type: z.enum(["transfer", "income_expenses"]),
    amount: z.number(),
    date: z.string(),
    receipt: z.string(),
    created: z.string(),
    updated: z.string(),
  }),
  categories_aggregated: z.object({
    type: z.enum(["income", "expenses"]),
    name: z.string(),
    icon: z.string(),
    color: z.string(),
    amount: z.number(),
  }),
  assets_aggregated: z.object({
    name: z.string(),
    icon: z.string(),
    starting_balance: z.number(),
    transaction_count: z.number(),
    current_balance: z.any(),
  }),
  ledgers_aggregated: z.object({
    name: z.string(),
    color: z.string(),
    icon: z.string(),
    amount: z.number(),
  }),
  transaction_types_aggregated: z.object({
    name: z.any(),
    transaction_count: z.number(),
    accumulated_amount: z.any(),
  }),
  transactions_income_expenses: z.object({
    base_transaction: z.string(),
    type: z.enum(["income", "expenses"]),
    particulars: z.string(),
    asset: z.string(),
    category: z.string(),
    ledgers: z.array(z.string()),
    location_name: z.string(),
    location_coords: z.object({ lat: z.number(), lon: z.number() }),
  }),
  transactions_transfer: z.object({
    base_transaction: z.string(),
    from: z.string(),
    to: z.string(),
  }),
  transaction_templates: z.object({
    name: z.string(),
    type: z.enum(["income", "expenses"]),
    amount: z.number(),
    particulars: z.string(),
    asset: z.string(),
    category: z.string(),
    ledgers: z.array(z.string()),
    location_name: z.string(),
    location_coords: z.object({ lat: z.number(), lon: z.number() }),
  }),
};

export default walletSchemas;
