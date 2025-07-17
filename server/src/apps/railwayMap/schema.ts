/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: railwayMap
 * Generated at: 2025-07-09T12:50:41.284Z
 * Contains: railway_map__lines, railway_map__stations
 */
import { z } from "zod/v4";

const RailwayMapLineSchema = z.object({
  country: z.string(),
  type: z.string(),
  code: z.string(),
  name: z.string(),
  color: z.string(),
  ways: z.any(),
  map_paths: z.any(),
});

const RailwayMapStationSchema = z.object({
  name: z.string(),
  desc: z.string(),
  lines: z.array(z.string()),
  codes: z.any(),
  coords: z.any(),
  map_data: z.any(),
  type: z.string(),
  distances: z.any(),
  map_image: z.string(),
});

type IRailwayMapLine = z.infer<typeof RailwayMapLineSchema>;
type IRailwayMapStation = z.infer<typeof RailwayMapStationSchema>;

export { RailwayMapLineSchema, RailwayMapStationSchema };

export type { IRailwayMapLine, IRailwayMapStation };

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
