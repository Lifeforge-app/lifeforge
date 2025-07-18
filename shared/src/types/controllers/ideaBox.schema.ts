import { z } from 'zod/v4'

import { IdeaBoxCollectionsSchemas } from '../collections'
import { SchemaWithPB } from '../collections/schemaWithPB'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Ideas = {
  /**
   * @route       GET /:container/*
   * @description Get ideas from a folder
   */
  getIdeas: {
    params: z.object({
      container: z.string(),
      '0': z.string()
    }),
    query: z.object({
      archived: z
        .string()
        .optional()
        .transform(val => val === 'true')
    }),
    response: z.array(SchemaWithPB(IdeaBoxCollectionsSchemas.Entry))
  },

  /**
   * @route       POST /
   * @description Create a new idea
   */
  createIdea: {
    body: IdeaBoxCollectionsSchemas.Entry.pick({
      type: true,
      container: true,
      folder: true,
      title: true,
      content: true,
      tags: true
    }).extend({
      imageLink: z.string().optional(),
      tags: z.string().transform(val => JSON.parse(val))
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Entry)
  },

  /**
   * @route       PATCH /:id
   * @description Update an idea
   */
  updateIdea: {
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      type: z.enum(['text', 'link', 'image']),
      tags: z.array(z.string()).optional()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Entry)
  },

  /**
   * @route       DELETE /:id
   * @description Delete an idea
   */
  deleteIdea: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  },

  /**
   * @route       POST /pin/:id
   * @description Pin/unpin an idea
   */
  pinIdea: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Entry)
  },

  /**
   * @route       POST /archive/:id
   * @description Archive/unarchive an idea
   */
  archiveIdea: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Entry)
  },

  /**
   * @route       POST /move/:id
   * @description Move an idea to a different folder
   */
  moveIdea: {
    params: z.object({
      id: z.string()
    }),
    query: z.object({
      target: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Entry)
  },

  /**
   * @route       DELETE /move/:id
   * @description Remove an idea from its current folder
   */
  removeFromFolder: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Entry)
  }
}

const Misc = {
  /**
   * @route       GET /path/:container/*
   * @description Get path information for a container
   */
  getPath: {
    params: z.object({
      container: z.string(),
      '0': z.string()
    }),
    response: z.any()
  },

  /**
   * @route       GET /valid/:container/*
   * @description Check if a path is valid
   */
  checkValid: {
    params: z.object({
      container: z.string(),
      '0': z.string()
    }),
    response: z.boolean()
  },

  /**
   * @route       GET /og-data/:id
   * @description Get Open Graph data for an entry
   */
  getOgData: {
    params: z.object({
      id: z.string()
    }),
    response: z.record(z.string(), z.any())
  },

  /**
   * @route       GET /search
   * @description Search entries
   */
  search: {
    query: z.object({
      q: z.string(),
      container: z.string().optional(),
      tags: z.string().optional(),
      folder: z.string().optional()
    }),
    response: z.any()
  }
}

const Containers = {
  /**
   * @route       GET /valid/:id
   * @description Check if a container exists
   */
  checkContainerExists: {
    params: z.object({
      id: z.string()
    }),
    response: z.boolean()
  },

  /**
   * @route       GET /
   * @description Get all containers
   */
  getContainers: {
    response: z.array(SchemaWithPB(IdeaBoxCollectionsSchemas.Container))
  },

  /**
   * @route       POST /
   * @description Create a new container
   */
  createContainer: {
    body: IdeaBoxCollectionsSchemas.Container,
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Container)
  },

  /**
   * @route       PATCH /:id
   * @description Update a container
   */
  updateContainer: {
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      cover: z.string().optional()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Container)
  },

  /**
   * @route       DELETE /:id
   * @description Delete a container
   */
  deleteContainer: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

const Folders = {
  /**
   * @route       GET /:container/*
   * @description Get folders from a container path
   */
  getFolders: {
    params: z.object({
      container: z.string(),
      '0': z.string()
    }),
    response: z.array(SchemaWithPB(IdeaBoxCollectionsSchemas.Folder))
  },

  /**
   * @route       POST /
   * @description Create a new folder
   */
  createFolder: {
    body: z.object({
      name: z.string(),
      container: z.string(),
      parent: z.string(),
      icon: z.string(),
      color: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Folder)
  },

  /**
   * @route       PATCH /:id
   * @description Update a folder
   */
  updateFolder: {
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Folder)
  },

  /**
   * @route       POST /move/:id
   * @description Move a folder to a different parent
   */
  moveFolder: {
    params: z.object({
      id: z.string()
    }),
    query: z.object({
      target: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Folder)
  },

  /**
   * @route       DELETE /move/:id
   * @description Remove a folder from its parent
   */
  removeFromFolder: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Folder)
  },

  /**
   * @route       DELETE /:id
   * @description Delete a folder
   */
  deleteFolder: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

const Tags = {
  /**
   * @route       GET /:container
   * @description Get tags for a container
   */
  getTags: {
    params: z.object({
      container: z.string()
    }),
    response: z.array(SchemaWithPB(IdeaBoxCollectionsSchemas.Tag))
  },

  /**
   * @route       POST /:container
   * @description Create a new tag
   */
  createTag: {
    body: IdeaBoxCollectionsSchemas.Tag,
    params: z.object({
      container: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Tag)
  },

  /**
   * @route       PATCH /:id
   * @description Update a tag
   */
  updateTag: {
    body: IdeaBoxCollectionsSchemas.Tag,
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(IdeaBoxCollectionsSchemas.Tag)
  },

  /**
   * @route       DELETE /:id
   * @description Delete a tag
   */
  deleteTag: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

type IIdeas = InferApiESchemaDynamic<typeof Ideas>
type IMisc = InferApiESchemaDynamic<typeof Misc>
type IContainers = InferApiESchemaDynamic<typeof Containers>
type IFolders = InferApiESchemaDynamic<typeof Folders>
type ITags = InferApiESchemaDynamic<typeof Tags>

export type { IIdeas, IMisc, IContainers, IFolders, ITags }

export { Ideas, Misc, Containers, Folders, Tags }
