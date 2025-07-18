import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { WalletControllersSchemas } from "shared/types/controllers";

import { singleUploadMiddleware } from "@middlewares/uploadMiddleware";

import * as TransactionsService from "../services/transactions.service";

const walletTransactionsRouter = express.Router();

const getAllTransactions = forgeController
  .route("GET /")
  .description("Get all wallet transactions")
  .schema(WalletControllersSchemas.Transactions.getAllTransactions)
  .callback(async ({ pb }) => await TransactionsService.getAllTransactions(pb));

const createTransaction = forgeController
  .route("POST /")
  .description("Create a new wallet transaction")
  .schema(WalletControllersSchemas.Transactions.createTransaction)
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
  .schema(WalletControllersSchemas.Transactions.updateTransaction)
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
  .schema(WalletControllersSchemas.Transactions.deleteTransaction)
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
  .schema(WalletControllersSchemas.Transactions.scanReceipt)
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
