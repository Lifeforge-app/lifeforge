import { z } from "zod";

const usersSchemas = {
  users: z.object({
    password: z.string(),
    tokenKey: z.string(),
    email: z.email(),
    emailVisibility: z.boolean(),
    verified: z.boolean(),
    username: z.string(),
    name: z.string(),
    avatar: z.string(),
    dateOfBirth: z.string(),
    theme: z.enum(["system", "light", "dark"]),
    color: z.string(),
    bgTemp: z.string(),
    bgImage: z.string(),
    backdropFilters: z.any(),
    fontFamily: z.string(),
    language: z.enum(["zh-CN", "en", "ms", "zh-TW", ""]),
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
    fontScale: z.number(),
    created: z.string(),
    updated: z.string(),
  }),
};

export default usersSchemas;
