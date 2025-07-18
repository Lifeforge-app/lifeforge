import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";

const Entries = {
  /**
   * @route       GET /sidebar-data
   * @description Get sidebar data for virtual wardrobe
   */
  getSidebarData: {
    response: VirtualWardrobeSchemas.VirtualWardrobeSidebarDataSchema,
  },

  /**
   * @route       GET /
   * @description Get virtual wardrobe entries with optional filters
   */
  getEntries: {
    query: z.object({
      category: z.string().optional(),
      subcategory: z.string().optional(),
      brand: z.string().optional(),
      size: z.string().optional(),
      color: z.string().optional(),
      favourite: z
        .string()
        .optional()
        .transform((val) => val === "true"),
      q: z.string().optional(),
    }),
    response: z.array(SchemaWithPB(VirtualWardrobeSchemas.EntrySchema)),
  },

  /**
   * @route       POST /
   * @description Create a new virtual wardrobe entry
   */
  createEntry: {
    body: z.object({
      name: z.string(),
      category: z.string(),
      subcategory: z.string(),
      brand: z.string(),
      size: z.string(),
      colors: z.array(z.string()),
      price: z.string().transform((val) => parseFloat(val)),
      notes: z.string(),
    }),
    response: SchemaWithPB(VirtualWardrobeSchemas.EntrySchema),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing virtual wardrobe entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string().optional(),
      category: z.string().optional(),
      subcategory: z.string().optional(),
      brand: z.string().optional(),
      size: z.string().optional(),
      colors: z.array(z.string()).optional(),
      price: z.number().optional(),
      notes: z.string().optional(),
    }),
    response: SchemaWithPB(VirtualWardrobeSchemas.EntrySchema),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a virtual wardrobe entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       PATCH /favourite/:id
   * @description Toggle favourite status of a virtual wardrobe entry
   */
  toggleFavourite: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(VirtualWardrobeSchemas.EntrySchema),
  },

  /**
   * @route       POST /vision
   * @description Analyze clothing images using AI vision
   */
  analyzeVision: {
    response: z.object({
      name: z.string(),
      category: z.string(),
      subcategory: z.string(),
      colors: z.array(z.string()),
    }),
  },
};

const Session = {
  /**
   * @route       GET /cart
   * @description Get session cart items
   */
  getCart: {
    response: z.array(SchemaWithPB(VirtualWardrobeSchemas.EntrySchema)),
  },

  /**
   * @route       POST /cart/:id
   * @description Add item to session cart
   */
  addToCart: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       DELETE /cart/:id
   * @description Remove item from session cart
   */
  removeFromCart: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       POST /checkout
   * @description Checkout session cart
   */
  checkout: {
    body: z.object({
      notes: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       DELETE /cart
   * @description Clear session cart
   */
  clearCart: {
    response: z.void(),
  },
};

type IEntries = z.infer<typeof Entries>;
type ISession = z.infer<typeof Session>;

export type { IEntries, ISession };
export { Entries, Session };
