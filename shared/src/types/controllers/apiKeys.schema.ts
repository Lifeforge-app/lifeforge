import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { ApiKeysCollectionsSchemas } from "../collections";
import type { InferApiESchemaDynamic } from "../utils/inferSchema";

const Auth = {
  /**
   * @route       GET /challenge
   * @description Get authentication challenge
   */
  getChallenge: {
    response: z.string(),
  },

  /**
   * @route       POST /
   * @description Create or update master password
   */
  createOrUpdateMasterPassword: {
    body: z.object({
      password: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       POST /verify
   * @description Verify master password
   */
  verifyMasterPassword: {
    body: z.object({
      password: z.string(),
    }),
    response: z.boolean(),
  },

  /**
   * @route       POST /otp
   * @description Verify OTP
   */
  verifyOtp: {
    body: z.object({
      otp: z.string(),
      otpId: z.string(),
    }),
    response: z.boolean(),
  },
};

const Entries = {
  /**
   * @route       GET /
   * @description Get all API key entries
   */
  getAllEntries: {
    query: z.object({
      master: z.string(),
    }),
    response: z.array(SchemaWithPB(ApiKeysCollectionsSchemas.Entry)),
  },

  /**
   * @route       GET /check
   * @description Check if API keys exist
   */
  checkKeys: {
    query: z.object({
      keys: z.string(),
    }),
    response: z.boolean(),
  },

  /**
   * @route       GET /:id
   * @description Get API key entry by ID
   */
  getEntryById: {
    params: z.object({
      id: z.string(),
    }),
    query: z.object({
      master: z.string(),
    }),
    response: z.string(),
  },

  /**
   * @route       POST /
   * @description Create a new API key entry
   */
  createEntry: {
    body: z.object({
      data: z.string(),
    }),
    response: SchemaWithPB(ApiKeysCollectionsSchemas.Entry),
  },

  /**
   * @route       PATCH /:id
   * @description Update an API key entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      data: z.string(),
    }),
    response: SchemaWithPB(ApiKeysCollectionsSchemas.Entry),
  },

  /**
   * @route       DELETE /:id
   * @description Delete an API key entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

type IAuth = InferApiESchemaDynamic<typeof Auth>;
type IEntries = InferApiESchemaDynamic<typeof Entries>;

export type { IAuth, IEntries };

export { Auth, Entries };
