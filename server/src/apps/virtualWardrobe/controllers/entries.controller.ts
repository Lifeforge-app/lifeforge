import {
  bulkRegisterControllers,
  forgeController,
} from "@functions/forgeController";
import express from "express";
import fs from "fs";
import { z } from "zod/v4";

import { WithPBSchema } from "@typescript/pocketbase_interfaces";

import { fieldsUploadMiddleware } from "@middlewares/uploadMiddleware";

import {
  VirtualWardrobeEntrySchema,
  VirtualWardrobeSidebarDataSchema,
} from "../schema";
import * as entriesService from "../services/entries.service";
import * as visionService from "../services/vision.service";

const virtualWardrobeEntriesRouter = express.Router();

const getSidebarData = forgeController
  .route("GET /sidebar-data")
  .description("Get sidebar data for virtual wardrobe")
  .schema({
    response: VirtualWardrobeSidebarDataSchema,
  })
  .callback(async ({ pb }) => await entriesService.getSidebarData(pb));

const getEntries = forgeController
  .route("GET /")
  .description("Get virtual wardrobe entries with optional filters")
  .schema({
    query: z.object({
      category: z.string().optional(),
      subcategory: z.string().optional(),
      brand: z.string().optional(),
      size: z.string().optional(),
      color: z.string().optional(),
      favourite: z
        .string()
        .optional()
        .transform((val) => val === "true"),
      q: z.string().optional(),
    }),
    response: z.array(WithPBSchema(VirtualWardrobeEntrySchema)),
  })
  .callback(
    async ({ pb, query }) => await entriesService.getEntries(pb, query),
  );

const createEntry = forgeController
  .route("POST /")
  .description("Create a new virtual wardrobe entry")
  .schema({
    body: z.object({
      name: z.string(),
      category: z.string(),
      subcategory: z.string(),
      brand: z.string(),
      size: z.string(),
      colors: z.array(z.string()),
      price: z.string().transform((val) => parseFloat(val)),
      notes: z.string(),
    }),
    response: WithPBSchema(VirtualWardrobeEntrySchema),
  })
  .middlewares(
    fieldsUploadMiddleware.bind({
      fields: [
        { name: "backImage", maxCount: 1 },
        { name: "frontImage", maxCount: 1 },
      ],
    }),
  )
  .statusCode(201)
  .callback(async ({ pb, body, req }) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      backImage: [backImage],
      frontImage: [frontImage],
    } = files;

    if (!frontImage || !backImage) {
      throw new Error("Both front and back images are required");
    }

    try {
      const frontImageBuffer = fs.readFileSync(frontImage.path);
      const backImageBuffer = fs.readFileSync(backImage.path);

      const result = await entriesService.createEntry(pb, {
        ...body,
        front_image: new File([frontImageBuffer], frontImage.originalname),
        back_image: new File([backImageBuffer], backImage.originalname),
      });

      return result;
    } finally {
      // Clean up uploaded files
      if (frontImage?.path) fs.unlinkSync(frontImage.path);
      if (backImage?.path) fs.unlinkSync(backImage.path);
    }
  });

const updateEntry = forgeController
  .route("PATCH /:id")
  .description("Update an existing virtual wardrobe entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string().optional(),
      category: z.string().optional(),
      subcategory: z.string().optional(),
      brand: z.string().optional(),
      size: z.string().optional(),
      colors: z.array(z.string()).optional(),
      price: z.number().optional(),
      notes: z.string().optional(),
    }),
    response: WithPBSchema(VirtualWardrobeEntrySchema),
  })
  .existenceCheck("params", {
    id: "virtual_wardrobe__entries",
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await entriesService.updateEntry(pb, id, body),
  );

const deleteEntry = forgeController
  .route("DELETE /:id")
  .description("Delete a virtual wardrobe entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  })
  .existenceCheck("params", {
    id: "virtual_wardrobe__entries",
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id),
  );

const toggleFavourite = forgeController
  .route("PATCH /favourite/:id")
  .description("Toggle favourite status of a virtual wardrobe entry")
  .schema({
    params: z.object({
      id: z.string(),
    }),
    response: WithPBSchema(VirtualWardrobeEntrySchema),
  })
  .existenceCheck("params", {
    id: "virtual_wardrobe__entries",
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await entriesService.toggleFavourite(pb, id),
  );

const analyzeVision = forgeController
  .route("POST /vision")
  .description("Analyze clothing images using AI vision")
  .schema({
    response: z.object({
      name: z.string(),
      category: z.string(),
      subcategory: z.string(),
      colors: z.array(z.string()),
    }),
  })
  .middlewares(
    fieldsUploadMiddleware.bind({
      fields: [
        { name: "frontImage", maxCount: 1 },
        { name: "backImage", maxCount: 1 },
      ],
    }),
  )
  .callback(async ({ pb, req }) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      frontImage: [frontImage],
      backImage: [backImage],
    } = files;

    if (!frontImage || !backImage) {
      throw new Error("Both front and back images are required");
    }

    try {
      const result = await visionService.analyzeClothingImages(
        pb,
        frontImage.path,
        backImage.path,
      );

      return result;
    } finally {
      // Clean up uploaded files
      if (frontImage?.path) fs.unlinkSync(frontImage.path);
      if (backImage?.path) fs.unlinkSync(backImage.path);
    }
  });

bulkRegisterControllers(virtualWardrobeEntriesRouter, [
  getSidebarData,
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleFavourite,
  analyzeVision,
]);

export default virtualWardrobeEntriesRouter;
