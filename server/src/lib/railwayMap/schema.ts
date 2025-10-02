import { z } from "zod";

const railwayMapSchemas = {
  lines: z.object({
    country: z.string(),
    type: z.string(),
    code: z.string(),
    name: z.string(),
    color: z.string(),
    ways: z.any(),
    map_paths: z.any(),
  }),
  stations: z.object({
    name: z.string(),
    desc: z.string(),
    lines: z.array(z.string()),
    codes: z.any(),
    coords: z.any(),
    map_data: z.any(),
    type: z.string(),
    distances: z.any(),
    map_image: z.string(),
  }),
};

export default railwayMapSchemas;
