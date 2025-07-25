/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: railwayMap
 * Generated at: 2025-07-20T12:17:56.586Z
 * Contains: line, station
 */
import { z } from 'zod/v4'

const Line = z.object({
  country: z.string(),
  type: z.string(),
  code: z.string(),
  name: z.string(),
  color: z.string(),
  ways: z.any(),
  map_paths: z.any()
})

const Station = z.object({
  name: z.string(),
  desc: z.string(),
  lines: z.array(z.string()),
  codes: z.any(),
  coords: z.any(),
  map_data: z.any(),
  type: z.string(),
  distances: z.any(),
  map_image: z.string()
})

type ILine = z.infer<typeof Line>
type IStation = z.infer<typeof Station>

export { Line, Station }

export type { ILine, IStation }

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
