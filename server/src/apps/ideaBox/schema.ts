/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: ideaBox
 * Generated at: 2025-07-09T12:50:41.284Z
 * Contains: idea_box__containers, idea_box__entries, idea_box__folders, idea_box__tags, idea_box__tags_aggregated, idea_box__containers_aggregated
 */
import { z } from "zod/v4";

const IdeaBoxContainerSchema = z.object({
  icon: z.string(),
  color: z.string(),
  name: z.string(),
  cover: z.string(),
});

const IdeaBoxEntrySchema = z.object({
  type: z.enum(["text", "image", "link"]),
  image: z.string(),
  title: z.string(),
  content: z.string(),
  container: z.string(),
  folder: z.string(),
  pinned: z.boolean(),
  archived: z.boolean(),
  tags: z.any(),
});

const IdeaBoxFolderSchema = z.object({
  container: z.string(),
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  parent: z.string(),
});

const IdeaBoxTagSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  container: z.string(),
});

const IdeaBoxTagAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  container: z.string(),
  amount: z.number(),
});

const IdeaBoxContainerAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  cover: z.string(),
  text_count: z.number(),
  link_count: z.number(),
  image_count: z.number(),
});

type IIdeaBoxContainer = z.infer<typeof IdeaBoxContainerSchema>;
type IIdeaBoxEntry = z.infer<typeof IdeaBoxEntrySchema>;
type IIdeaBoxFolder = z.infer<typeof IdeaBoxFolderSchema>;
type IIdeaBoxTag = z.infer<typeof IdeaBoxTagSchema>;
type IIdeaBoxTagAggregated = z.infer<typeof IdeaBoxTagAggregatedSchema>;
type IIdeaBoxContainerAggregated = z.infer<
  typeof IdeaBoxContainerAggregatedSchema
>;

export {
  IdeaBoxContainerSchema,
  IdeaBoxEntrySchema,
  IdeaBoxFolderSchema,
  IdeaBoxTagSchema,
  IdeaBoxTagAggregatedSchema,
  IdeaBoxContainerAggregatedSchema,
};

export type {
  IIdeaBoxContainer,
  IIdeaBoxEntry,
  IIdeaBoxFolder,
  IIdeaBoxTag,
  IIdeaBoxTagAggregated,
  IIdeaBoxContainerAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
