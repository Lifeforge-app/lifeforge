import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { WalletLedgerSchema } from "../schema";
import * as LedgersService from "../services/ledgers.service";

const walletLedgersRouter = express.Router();

const getAllLedgers = forgeController
  .route("GET /")
  .description("Get all wallet ledgers")
  .schema({
    response: z.array(WithPBSchema(WalletLedgerSchema)),
  })
  .callback(async ({ pb }) => await LedgersService.getAllLedgers(pb));

const createLedger = forgeController
  .route("POST /")
  .description("Create a new wallet ledger")
  .schema({
    body: WalletLedgerSchema,
    response: WithPBSchema(WalletLedgerSchema),
  })
  .statusCode(201)
  .callback(
    async ({ pb, body }) => await LedgersService.createLedger(pb, body),
  );

const updateLedger = forgeController
  .route("PATCH /:id")
  .description("Update an existing wallet ledger")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: WalletLedgerSchema,
    response: WithPBSchema(WalletLedgerSchema),
  })
  .existenceCheck("params", {
    id: "wallet__ledgers",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await LedgersService.updateLedger(pb, id, body),
  );

const deleteLedger = forgeController
  .route("DELETE /:id")
  .description("Delete a wallet ledger")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "wallet__ledgers",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await LedgersService.deleteLedger(pb, id),
  );

bulkRegisterControllers(walletLedgersRouter, [
  getAllLedgers,
  createLedger,
  updateLedger,
  deleteLedger,
]);

export default walletLedgersRouter;
