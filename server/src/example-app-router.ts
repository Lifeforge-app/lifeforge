// Example usage of the enhanced forgeRouter with full type inference
import forgeRouter from '@functions/forgeRouter'
import type { InferRouterStructure } from '@functions/forgeRouter'
import type { GetController, RouterPaths } from '@typescript/router.types'

import achievementsRouter from '../apps/achievements'

// Create a main app router with nested structure
const appRouter = forgeRouter({
  achievements: achievementsRouter
  // Add more modules here as you build them
  // wallet: walletRouter,
  // ideaBox: ideaBoxRouter,
  // etc...
})

// Export the type for the entire app router structure
export type AppRouter = typeof appRouter

// Extract the structure type for advanced type operations
export type AppRouterStructure = InferRouterStructure<AppRouter>

// Get all available paths in dot notation (like tRPC)
export type AppRouterPaths = RouterPaths<AppRouterStructure>

// Examples of how to use the type system:

// Get a specific controller type
export type AchievementsCreateController = GetController<
  AppRouterStructure,
  'achievements.entries.create'
>

// Get all achievement controllers
export type AchievementsControllers = GetController<
  AppRouterStructure,
  'achievements.entries'
>

export default appRouter

/* 
Usage examples in client code:

// You can now infer the complete structure
type MyAppRouter = typeof appRouter

// Get available paths with autocomplete
type AvailablePaths = AppRouterPaths
// This will be: "achievements.entries.getAllByDifficulty" | "achievements.entries.create" | "achievements.entries.update" | "achievements.entries.delete"

// Type-safe access to specific controllers
type CreateController = GetController<AppRouterStructure, "achievements.entries.create">

// In your client code, you can use these types for type-safe API calls
*/
