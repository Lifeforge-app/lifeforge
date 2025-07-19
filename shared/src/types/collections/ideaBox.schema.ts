/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: ideaBox
 * Generated at: 2025-07-19T14:07:18.233Z
 * Contains: idea_box__containers, idea_box__entries, idea_box__folders, idea_box__tags, idea_box__tags_aggregated, idea_box__containers_aggregated
 */

import { z } from "zod/v4";

const Container = z.object({
  icon: z.string(),
  color: z.string(),
  name: z.string(),
  cover: z.string(),
});

const Entry = z.object({
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

const Folder = z.object({
  container: z.string(),
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  parent: z.string(),
});

const Tag = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  container: z.string(),
});

const TagAggregated = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  container: z.string(),
  amount: z.number(),
});

const ContainerAggregated = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  cover: z.string(),
  text_count: z.number(),
  link_count: z.number(),
  image_count: z.number(),
});

type IContainer = z.infer<typeof Container>;
type IEntry = z.infer<typeof Entry>;
type IFolder = z.infer<typeof Folder>;
type ITag = z.infer<typeof Tag>;
type ITagAggregated = z.infer<typeof TagAggregated>;
type IContainerAggregated = z.infer<typeof ContainerAggregated>;

export {
  Container,
  Entry,
  Folder,
  Tag,
  TagAggregated,
  ContainerAggregated,
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
