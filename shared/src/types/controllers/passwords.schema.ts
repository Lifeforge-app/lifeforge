import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";

const Entries = {
  /**
   * @route       GET /challenge
   * @description Get current challenge for password operations
   */
  getChallenge: {
    response: z.string(),
  },

  /**
   * @route       GET /
   * @description Get all password entries
   */
  getAllEntries: {
    response: z.array(SchemaWithPB(PasswordsSchemas.EntrySchema)),
  },

  /**
   * @route       POST /
   * @description Create a new password entry
   */
  createEntry: {
    body: PasswordsSchemas.EntrySchema.omit({
      pinned: true,
    }).extend({
      master: z.string(),
    }),
    response: SchemaWithPB(PasswordsSchemas.EntrySchema),
  },

  /**
   * @route       PATCH /:id
   * @description Update a password entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: PasswordsSchemas.EntrySchema.omit({
      pinned: true,
    }).extend({
      master: z.string(),
    }),
    response: SchemaWithPB(PasswordsSchemas.EntrySchema),
  },

  /**
   * @route       POST /decrypt/:id
   * @description Decrypt a password entry
   */
  decryptEntry: {
    params: z.object({
      id: z.string(),
    }),
    query: z.object({
      master: z.string(),
    }),
    response: z.string(),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a password entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       POST /pin/:id
   * @description Toggle pin status of a password entry
   */
  togglePin: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(PasswordsSchemas.EntrySchema),
  },
};

const Master = {
  /**
   * @route       GET /challenge
   * @description Get current challenge for master password operations
   */
  getChallenge: {
    response: z.string(),
  },

  /**
   * @route       POST /
   * @description Create a new master password
   */
  createMaster: {
    body: z.object({
      password: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       POST /verify
   * @description Verify master password
   */
  verifyMaster: {
    body: z.object({
      password: z.string(),
    }),
    response: z.boolean(),
  },

  /**
   * @route       POST /otp
   * @description Validate OTP for master password operations
   */
  validateOtp: {
    body: z.object({
      otp: z.string(),
      otpId: z.string(),
    }),
    response: z.boolean(),
  },
};

type IEntries = z.infer<typeof Entries>;
type IMaster = z.infer<typeof Master>;

export type { IEntries, IMaster };
export { Entries, Master };
