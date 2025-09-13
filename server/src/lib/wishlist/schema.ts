import { z } from "zod/v4";

const wishlistSchemas = {
  lists: z.object({
    name: z.string(),
    description: z.string(),
    color: z.string(),
    icon: z.string(),
  }),
  entries: z.object({
    name: z.string(),
    url: z.string(),
    price: z.number(),
    image: z.string(),
    list: z.string(),
    bought: z.boolean(),
    bought_at: z.string(),
    created: z.string(),
    updated: z.string(),
  }),
  lists_aggregated: z.object({
    name: z.string(),
    description: z.string(),
    color: z.string(),
    icon: z.string(),
    total_count: z.number(),
    total_amount: z.any(),
    bought_count: z.number(),
    bought_amount: z.any(),
  }),
};

export default wishlistSchemas;
