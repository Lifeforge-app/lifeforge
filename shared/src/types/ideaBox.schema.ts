/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: ideaBox
 * Generated at: 2025-07-17T08:55:29.695Z
 * Contains: idea_box__containers, idea_box__entries, idea_box__folders, idea_box__tags, idea_box__tags_aggregated, idea_box__containers_aggregated
 */

import { z } from "zod/v4";
const ContainerSchema = z.object({
  icon: z.string(),
  color: z.string(),
  name: z.string(),
  cover: z.string(),
});

const EntrySchema = z.object({
  type: z.enum(["text","image","link"]),
  image: z.string(),
  title: z.string(),
  content: z.string(),
  container: z.string(),
  folder: z.string(),
  pinned: z.boolean(),
  archived: z.boolean(),
  tags: z.any(),
});

const FolderSchema = z.object({
  container: z.string(),
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  parent: z.string(),
});

const TagSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  container: z.string(),
});

const TagAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  container: z.string(),
  amount: z.number(),
});

const ContainerAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  cover: z.string(),
  text_count: z.number(),
  link_count: z.number(),
  image_count: z.number(),
});

type IContainer = z.infer<typeof ContainerSchema>;
type IEntry = z.infer<typeof EntrySchema>;
type IFolder = z.infer<typeof FolderSchema>;
type ITag = z.infer<typeof TagSchema>;
type ITagAggregated = z.infer<typeof TagAggregatedSchema>;
type IContainerAggregated = z.infer<typeof ContainerAggregatedSchema>;

export {
  ContainerSchema,
  EntrySchema,
  FolderSchema,
  TagSchema,
  TagAggregatedSchema,
  ContainerAggregatedSchema,
};

export type {
  IContainer,
  IEntry,
  IFolder,
  ITag,
  ITagAggregated,
  IContainerAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
