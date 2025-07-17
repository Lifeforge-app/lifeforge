import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { WalletSchemas } from "shared";
import { z } from "zod/v4";

import * as UtilsService from "../services/utils.service";

const walletUtilsRouter = express.Router();

const getTypesCount = forgeController
  .route("GET /types-count")
  .description("Get wallet transaction types count and accumulation")
  .schema({
    response: z.record(
      z.string(),
      z.object({
        amount: z.number(),
        accumulate: z.number(),
      }),
    ),
  })
  .callback(async ({ pb }) => await UtilsService.getTypesCount(pb));

const getIncomeExpensesSummary = forgeController
  .route("GET /income-expenses")
  .description("Get income and expenses summary for a specific month/year")
  .schema({
    query: z.object({
      year: z.string(),
      month: z.string(),
    }),
    response: WalletSchemas.WalletIncomeExpensesSummarySchema,
  })
  .callback(
    async ({ pb, query: { year, month } }) =>
      await UtilsService.getIncomeExpensesSummary(pb, year, month),
  );

const getExpensesBreakdown = forgeController
  .route("GET /expenses-breakdown")
  .description("Get expenses breakdown by category for a specific month/year")
  .schema({
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
      }),
    ),
  })
  .callback(
    async ({ pb, query: { year, month } }) =>
      await UtilsService.getExpensesBreakdown(pb, year, month),
  );

bulkRegisterControllers(walletUtilsRouter, [
  getTypesCount,
  getIncomeExpensesSummary,
  getExpensesBreakdown,
]);

export default walletUtilsRouter;
