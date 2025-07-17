import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import {
  WalletReceiptScanResultSchema,
  WalletTransactionSchema,
} from "../schema";
import * as TransactionsService from "../services/transactions.service";

const walletTransactionsRouter = express.Router();

const getAllTransactions = forgeController
  .route("GET /")
  .description("Get all wallet transactions")
  .schema({
    response: z.array(WithPBSchema(WalletTransactionSchema)),
  })
  .callback(async ({ pb }) => await TransactionsService.getAllTransactions(pb));

const createTransaction = forgeController
  .route("POST /")
  .description("Create a new wallet transaction")
  .schema({
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
    response: z.array(WithPBSchema(WalletTransactionSchema)),
  })
  .middlewares(singleUploadMiddleware)
  .existenceCheck("body", {
    category: "[wallet__categories]",
    asset: "[wallet__assets]",
    ledger: "[wallet__ledgers]",
    fromAsset: "[wallet__assets]",
    toAsset: "[wallet__assets]",
  })
  .statusCode(201)
  .callback(
    async ({ pb, body, req }) =>
      await TransactionsService.createTransaction(pb, body, req.file),
  );

const updateTransaction = forgeController
  .route("PATCH /:id")
  .description("Update an existing wallet transaction")
  .schema({
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
    response: WithPBSchema(WalletTransactionSchema),
  })
  .middlewares(singleUploadMiddleware)
  .existenceCheck("params", {
    id: "wallet__transactions",
  })
  .existenceCheck("body", {
    category: "wallet__categories",
    asset: "wallet__assets",
    ledger: "[wallet__ledgers]",
  })
  .callback(
    async ({ pb, params: { id }, body, req }) =>
      await TransactionsService.updateTransaction(
        pb,
        id,
        body,
        req.file,
        body.removeReceipt ?? false,
      ),
  );

const deleteTransaction = forgeController
  .route("DELETE /:id")
  .description("Delete a wallet transaction")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "wallet__transactions",
  })
  .statusCode(204)
  .callback(async ({ pb, params: { id } }) =>
    TransactionsService.deleteTransaction(pb, id),
  );

const scanReceipt = forgeController
  .route("POST /scan-receipt")
  .description("Scan receipt to extract transaction data")
  .schema({
    response: WalletReceiptScanResultSchema,
  })
  .middlewares(singleUploadMiddleware)
  .callback(async ({ pb, req }) => {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    return await TransactionsService.scanReceipt(pb, req.file);
  });

bulkRegisterControllers(walletTransactionsRouter, [
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  scanReceipt,
]);

export default walletTransactionsRouter;
