import { body, param, query } from "express-validator";

export const validateEntryId = param("id")
  .isString()
  .isLength({ min: 1 })
  .trim();

export const validateListId = param("id")
  .isString()
  .isLength({ min: 1 })
  .trim();

export const validateBoughtQuery = query("bought").isBoolean().optional();

export const validateExternalData = [
  body("provider").isString(),
  body("url").isString().isLength({ min: 1 }).trim(),
];

export const validateEntryData = [
  body("name").isString().isLength({ min: 1 }).trim(),
  body("url").isString().optional().trim(),
  body("price").isNumeric(),
  body("list").isString(),
];
