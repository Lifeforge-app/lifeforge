import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { VirtualWardrobeEntrySchema } from "../schema";
import * as sessionService from "../services/session.service";

const virtualWardrobeSessionRouter = express.Router();

const getCart = forgeController
  .route("GET /cart")
  .description("Get session cart items")
  .schema({
    response: z.array(WithPBSchema(VirtualWardrobeEntrySchema)),
  })
  .callback(async () => sessionService.getSessionCart());

const addToCart = forgeController
  .route("POST /cart/:id")
  .description("Add item to session cart")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "virtual_wardrobe__entries",
  })
  .callback(async ({ pb, params: { id } }) => {
    await sessionService.addToCart(pb, id);
  });

const removeFromCart = forgeController
  .route("DELETE /cart/:id")
  .description("Remove item from session cart")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "virtual_wardrobe__entries",
  })
  .callback(async ({ params: { id } }) => {
    sessionService.removeFromCart(id);
  });

const checkout = forgeController
  .route("POST /checkout")
  .description("Checkout session cart")
  .schema({
    body: z.object({
      notes: z.string(),
    }),
    response: z.void(),
  })
  .callback(async ({ pb, body: { notes } }) => {
    await sessionService.checkout(pb, notes);
  });

const clearCart = forgeController
  .route("DELETE /cart")
  .description("Clear session cart")
  .schema({
    response: z.void(),
  })
  .callback(async () => {
    sessionService.clearCart();
  });

bulkRegisterControllers(virtualWardrobeSessionRouter, [
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  clearCart,
]);

export default virtualWardrobeSessionRouter;
