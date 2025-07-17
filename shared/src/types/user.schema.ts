/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: user
 * Generated at: 2025-07-17T08:55:29.697Z
 * Contains: users
 */

import { z } from "zod/v4";
const UserSchema = z.object({
  password: z.string(),
  tokenKey: z.string(),
  email: z.email(),
  emailVisibility: z.boolean(),
  verified: z.boolean(),
  username: z.string(),
  name: z.string(),
  avatar: z.string(),
  dateOfBirth: z.string(),
  theme: z.enum(["system","light","dark"]),
  color: z.string(),
  bgTemp: z.string(),
  bgImage: z.string(),
  backdropFilters: z.any(),
  fontFamily: z.string(),
  language: z.enum(["zh-CN","en","ms","zh-TW",""]),
  moduleConfigs: z.any(),
  enabledModules: z.any(),
  dashboardLayout: z.any(),
  spotifyAccessToken: z.string(),
  spotifyRefreshToken: z.string(),
  spotifyTokenExpires: z.string(),
  masterPasswordHash: z.string(),
  journalMasterPasswordHash: z.string(),
  APIKeysMasterPasswordHash: z.string(),
  twoFASecret: z.string(),
});

type IUser = z.infer<typeof UserSchema>;

export {
  UserSchema,
};

export type {
  IUser,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
