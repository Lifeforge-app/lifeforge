import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { WalletAssetSchema } from "../schema";
import * as AssetsService from "../services/assets.service";

const walletAssetsRouter = express.Router();

const getAllAssets = forgeController
  .route("GET /")
  .description("Get all wallet assets")
  .schema({
    response: z.array(WithPBSchema(WalletAssetSchema)),
  })
  .callback(async ({ pb }) => await AssetsService.getAllAssets(pb));

const createAsset = forgeController
  .route("POST /")
  .description("Create a new wallet asset")
  .schema({
    body: WalletAssetSchema.pick({
      name: true,
      icon: true,
      starting_balance: true,
    }).extend({
      starting_balance: z.string().transform((val) => {
        const balance = parseFloat(val);
        return isNaN(balance) ? 0 : balance;
      }),
    }),
    response: WithPBSchema(WalletAssetSchema),
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => await AssetsService.createAsset(pb, body));

const getAssetAccumulatedBalance = forgeController
  .route("GET /balance/:id")
  .description("Get accumulated balance for a wallet asset")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.record(z.string(), z.number()),
  })
  .existenceCheck("params", {
    id: "wallet__assets",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await AssetsService.getAssetAccumulatedBalance(pb, id),
  );

const updateAsset = forgeController
  .route("PATCH /:id")
  .description("Update an existing wallet asset")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: WalletAssetSchema.pick({
      name: true,
      icon: true,
      starting_balance: true,
    }).extend({
      starting_balance: z.string().transform((val) => {
        const balance = parseFloat(val);
        return isNaN(balance) ? 0 : balance;
      }),
    }),
    response: WithPBSchema(WalletAssetSchema),
  })
  .existenceCheck("params", {
    id: "wallet__assets",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await AssetsService.updateAsset(pb, id, body),
  );

const deleteAsset = forgeController
  .route("DELETE /:id")
  .description("Delete a wallet asset")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "wallet__assets",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await AssetsService.deleteAsset(pb, id),
  );

bulkRegisterControllers(walletAssetsRouter, [
  getAllAssets,
  getAssetAccumulatedBalance,
  createAsset,
  updateAsset,
  deleteAsset,
]);

export default walletAssetsRouter;
