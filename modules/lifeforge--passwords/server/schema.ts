import z from 'zod'

import { cleanSchemas } from '@lifeforge/pocketbase'

export const schemas = {
  entries: {
    schema: z.object({
      name: z.string(),
      website: z.string(),
      username: z.string(),
      password: z.string(),
      icon: z.string(),
      color: z.string(),
      pinned: z.boolean(),
      category: z.string(),
      last_password_updated: z.string(),
      rotation_interval: z.number(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'passwords__entries',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'website',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'username',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'password',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'color',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          name: 'pinned',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          cascadeDelete: false,
          collectionId: 'passwords__categories',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'category',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          max: '',
          min: '',
          name: 'last_password_updated',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'rotation_interval',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate'
        }
      ],
      indexes: [],
      system: false
    }
  },
  categories: {
    schema: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'passwords__categories',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'color',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        }
      ],
      indexes: [],
      system: false
    }
  },
  categories_aggregated: {
    schema: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      amount: z.number()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'passwords__categories_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'color',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'SELECT\n  passwords__categories.id,\n  passwords__categories.name,\n  passwords__categories.color,\n  passwords__categories.icon,\n  COUNT(passwords__entries.id) AS amount\nFROM passwords__categories\nLEFT JOIN passwords__entries\n  ON passwords__categories.id = passwords__entries.category\nGROUP BY passwords__categories.id;'
    }
  },
  config: {
    schema: z.object({
      master_hash: z.string(),
      wrapped_vek: z.string(),
      recovery_wrapped_vek: z.string(),
      pin_hash: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'passwords__config',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'master_hash',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'wrapped_vek',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'recovery_wrapped_vek',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'pin_hash',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        }
      ],
      indexes: [],
      system: false
    }
  }
}

export default cleanSchemas(schemas)
