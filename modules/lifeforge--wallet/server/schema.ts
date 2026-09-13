import z from 'zod'

import { cleanSchemas } from '@lifeforge/pocketbase'

export const schemas = {
  assets: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      starting_balance: z.number()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__assets',
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
          name: 'starting_balance',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false
    }
  },
  ledgers: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__ledgers',
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
        }
      ],
      indexes: [],
      system: false
    }
  },
  categories: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      type: z.enum(['income', 'expenses'])
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__categories',
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
          maxSelect: 1,
          name: 'type',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['income', 'expenses']
        }
      ],
      indexes: [],
      system: false
    }
  },
  transactions: {
    schema: z.object({
      type: z.enum(['transfer', 'income_expenses']),
      amount: z.number(),
      date: z.string(),
      receipt: z.string(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__transactions',
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
          hidden: false,
          maxSelect: 1,
          name: 'type',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['transfer', 'income_expenses']
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
        },
        {
          hidden: false,
          max: '',
          min: '',
          name: 'date',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          hidden: false,
          maxSelect: 1,
          maxSize: 524288000,
          mimeTypes: null,
          name: 'receipt',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: null,
          type: 'file'
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
  categories_aggregated: {
    schema: z.object({
      type: z.enum(['income', 'expenses']),
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      amount: z.number()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'wallet__categories_aggregated',
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
          hidden: false,
          maxSelect: 1,
          name: 'type',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['income', 'expenses']
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
        'SELECT\n  wallet__categories.id,\n  wallet__categories.type,\n  wallet__categories.name,\n  wallet__categories.icon,\n  wallet__categories.color,\n  COUNT(wallet__transactions_income_expenses.id) AS amount\nFROM wallet__categories\nLEFT JOIN wallet__transactions_income_expenses ON wallet__transactions_income_expenses.category = wallet__categories.id\nGROUP BY wallet__categories.id'
    }
  },
  assets_aggregated: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      starting_balance: z.number(),
      transaction_count: z.number(),
      current_balance: z.any()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'wallet__assets_aggregated',
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
          name: 'starting_balance',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'transaction_count',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'current_balance',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        "WITH unified_transactions AS (\n  SELECT \n    id, \n    amount, \n    asset, \n    source \n  FROM \n    (\n      SELECT \n        CONCAT(\n          wallet__transactions.id, \"_\", wallet__transactions_income_expenses.type\n        ) as id, \n        wallet__transactions.amount,  \n        wallet__transactions_income_expenses.asset, \n        wallet__transactions_income_expenses.type as source \n      FROM \n        wallet__transactions_income_expenses\n        JOIN wallet__transactions ON wallet__transactions_income_expenses.base_transaction = wallet__transactions.id \n      UNION \n      SELECT  \n        concat(wallet__transactions.id, \"_out\") as id, \n        wallet__transactions.amount as amount, \n        wallet__transactions_transfer.\"from\" as asset, \n        'transfer_out' as source\n      FROM \n        wallet__transactions_transfer \n        JOIN wallet__transactions ON wallet__transactions_transfer.base_transaction = wallet__transactions.id \n      UNION \n      SELECT \n        concat(wallet__transactions.id, \"_in\") as id, \n        wallet__transactions.amount, \n        wallet__transactions_transfer.\"to\" as asset, \n        'transfer_in' as source \n      FROM \n        wallet__transactions_transfer \n        JOIN wallet__transactions ON wallet__transactions_transfer.base_transaction = wallet__transactions.id\n    )\n) \nSELECT \n  wallet__assets.id, \n  wallet__assets.name,\n  wallet__assets.icon,\n  wallet__assets.starting_balance,\n  COUNT(unified_transactions.id) AS transaction_count, \n  ROUND(\n    wallet__assets.starting_balance + SUM(\n      CASE \n        WHEN source = 'transfer_out' THEN - amount \n        WHEN source = 'transfer_in' THEN amount \n        WHEN source = 'income' THEN amount \n        WHEN source = 'expenses' THEN - amount \n        ELSE 0 \n      END\n    ), \n    2\n  ) AS current_balance \nFROM \n  unified_transactions \n  RIGHT JOIN wallet__assets ON wallet__assets.id = unified_transactions.asset \nGROUP BY \n  wallet__assets.id\n"
    }
  },
  ledgers_aggregated: {
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
      name: 'wallet__ledgers_aggregated',
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
        'WITH transaction_ledger_map AS (\n  SELECT\n    wallet__transactions_income_expenses.id AS transaction_id,\n    json_each.value AS ledger_id\n  FROM\n    wallet__transactions_income_expenses,\n    json_each(wallet__transactions_income_expenses.ledgers)\n)\nSELECT\n  wallet__ledgers.id,\n  wallet__ledgers.name,\n  wallet__ledgers.color,\n  wallet__ledgers.icon,\n  COUNT(transaction_ledger_map.transaction_id) AS amount\nFROM\n  wallet__ledgers\nLEFT JOIN transaction_ledger_map\n  ON transaction_ledger_map.ledger_id = wallet__ledgers.id\nGROUP BY\n  wallet__ledgers.id;'
    }
  },
  transaction_types_aggregated: {
    schema: z.object({
      name: z.any(),
      transaction_count: z.number(),
      accumulated_amount: z.any()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'wallet__transaction_types_aggregated',
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
          hidden: false,
          maxSize: 1,
          name: 'name',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'transaction_count',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'accumulated_amount',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'SELECT\n  (ROW_NUMBER() OVER()) as id,\n  (\n  CASE WHEN wallet__transactions.type = \'transfer\' THEN "transfer"\n  ELSE wallet__transactions_income_expenses.type\n  END\n  ) as name,\n  COUNT(wallet__transactions.id) as transaction_count,\n  SUM(wallet__transactions.amount) as accumulated_amount\nFROM wallet__transactions\nLEFT JOIN wallet__transactions_income_expenses\n  ON wallet__transactions.id = wallet__transactions_income_expenses.base_transaction\nLEFT JOIN wallet__transactions_transfer\n  ON wallet__transactions.id = wallet__transactions_transfer.base_transaction\nGROUP BY name\n'
    }
  },
  transactions_income_expenses: {
    schema: z.object({
      base_transaction: z.string(),
      type: z.enum(['income', 'expenses']),
      particulars: z.string(),
      asset: z.string(),
      category: z.string(),
      ledgers: z.array(z.string()),
      location_name: z.string(),
      location_coords: z.object({ lat: z.number(), lon: z.number() })
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__transactions_income_expenses',
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
          cascadeDelete: true,
          collectionId: 'wallet__transactions',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'base_transaction',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          maxSelect: 1,
          name: 'type',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['income', 'expenses']
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'particulars',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          cascadeDelete: true,
          collectionId: 'wallet__assets',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'asset',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'wallet__categories',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'category',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'wallet__ledgers',
          hidden: false,
          maxSelect: 999,
          minSelect: 0,
          name: 'ledgers',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'location_name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          name: 'location_coords',
          presentable: false,
          required: false,
          system: false,
          type: 'geoPoint'
        }
      ],
      indexes: [],
      system: false
    }
  },
  transactions_transfer: {
    schema: z.object({
      base_transaction: z.string(),
      from: z.string(),
      to: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__transactions_transfer',
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
          cascadeDelete: true,
          collectionId: 'wallet__transactions',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'base_transaction',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: true,
          collectionId: 'wallet__assets',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'from',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: true,
          collectionId: 'wallet__assets',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'to',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        }
      ],
      indexes: [],
      system: false
    }
  },
  transaction_templates: {
    schema: z.object({
      name: z.string(),
      type: z.enum(['income', 'expenses']),
      amount: z.number(),
      particulars: z.string(),
      asset: z.string(),
      category: z.string(),
      ledgers: z.array(z.string()),
      location_name: z.string(),
      location_coords: z.object({ lat: z.number(), lon: z.number() })
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__transaction_templates',
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
          required: true,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          maxSelect: 1,
          name: 'type',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['income', 'expenses']
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
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'particulars',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          cascadeDelete: true,
          collectionId: 'wallet__assets',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'asset',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'wallet__categories',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'category',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'wallet__ledgers',
          hidden: false,
          maxSelect: 999,
          minSelect: 0,
          name: 'ledgers',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'location_name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          name: 'location_coords',
          presentable: false,
          required: false,
          system: false,
          type: 'geoPoint'
        }
      ],
      indexes: [],
      system: false
    }
  },
  transactions_prompts: {
    schema: z.object({
      income: z.string(),
      expenses: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__transactions_prompts',
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
          max: 999999999999999,
          min: 0,
          name: 'income',
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
          max: 999999999999999,
          min: 0,
          name: 'expenses',
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
  expenses_location_aggregated: {
    schema: z.object({
      lat: z.any(),
      lng: z.any(),
      locationName: z.string(),
      amount: z.any(),
      count: z.number()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'wallet__expenses_location_aggregated',
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
          hidden: false,
          maxSize: 1,
          name: 'lat',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'lng',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'locationName',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'amount',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'count',
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
        "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  json_extract(wallet__transactions_income_expenses.location_coords, '$.lat') AS lat,\n  json_extract(wallet__transactions_income_expenses.location_coords, '$.lon') AS lng,\n  wallet__transactions_income_expenses.location_name AS locationName,\n  SUM(wallet__transactions.amount) AS amount,\n  COUNT(*) AS count\nFROM wallet__transactions_income_expenses\nINNER JOIN wallet__transactions \n  ON wallet__transactions_income_expenses.base_transaction = wallet__transactions.id\nWHERE \n  wallet__transactions_income_expenses.type = 'expenses'\n  AND wallet__transactions_income_expenses.location_name IS NOT NULL\n  AND wallet__transactions_income_expenses.location_name != ''\n  AND json_extract(wallet__transactions_income_expenses.location_coords, '$.lat') IS NOT NULL\n  AND json_extract(wallet__transactions_income_expenses.location_coords, '$.lat') != 0\n  AND json_extract(wallet__transactions_income_expenses.location_coords, '$.lon') IS NOT NULL\n  AND json_extract(wallet__transactions_income_expenses.location_coords, '$.lon') != 0\nGROUP BY \n  json_extract(wallet__transactions_income_expenses.location_coords, '$.lat'),\n  json_extract(wallet__transactions_income_expenses.location_coords, '$.lon'),\n  wallet__transactions_income_expenses.location_name"
    }
  },
  transactions_amount_aggregated: {
    schema: z.object({
      year: z.number(),
      month: z.number(),
      date: z.number(),
      income: z.any(),
      expenses: z.any(),
      transfer: z.any(),
      income_count: z.any(),
      expenses_count: z.any(),
      transfer_count: z.any()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'wallet__transactions_amount_aggregated',
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
          hidden: false,
          max: null,
          min: null,
          name: 'year',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'month',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'date',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'income',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'expenses',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'transfer',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'income_count',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'expenses_count',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'transfer_count',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        "WITH all_transactions AS (\n  SELECT\n    DATE(wallet__transactions.date) AS date_key,\n    wallet__transactions_income_expenses.type AS transaction_type,\n    wallet__transactions.amount AS amount\n  FROM wallet__transactions_income_expenses\n  INNER JOIN wallet__transactions \n    ON wallet__transactions_income_expenses.base_transaction = wallet__transactions.id\n  UNION ALL\n  SELECT\n    DATE(wallet__transactions.date) AS date_key,\n    'transfer' AS transaction_type,\n    wallet__transactions.amount AS amount\n  FROM wallet__transactions_transfer\n  INNER JOIN wallet__transactions \n    ON wallet__transactions_transfer.base_transaction = wallet__transactions.id\n)\nSELECT\n  (ROW_NUMBER() OVER()) as id,\n  CAST(strftime('%Y', date_key) AS INTEGER) AS year,\n  CAST(strftime('%m', date_key) AS INTEGER) AS month,\n  CAST(strftime('%d', date_key) AS INTEGER) AS date,\n  SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS income,\n  SUM(CASE WHEN transaction_type = 'expenses' THEN amount ELSE 0 END) AS expenses,\n  SUM(CASE WHEN transaction_type = 'transfer' THEN amount ELSE 0 END) AS transfer,\n  SUM(CASE WHEN transaction_type = 'income' THEN 1 ELSE 0 END) AS income_count,\n  SUM(CASE WHEN transaction_type = 'expenses' THEN 1 ELSE 0 END) AS expenses_count,\n  SUM(CASE WHEN transaction_type = 'transfer' THEN 1 ELSE 0 END) AS transfer_count\nFROM all_transactions\nGROUP BY date_key"
    }
  },
  budgets: {
    schema: z.object({
      category: z.string(),
      amount: z.number(),
      rollover_enabled: z.boolean(),
      rollover_cap: z.number(),
      alert_thresholds: z.any(),
      is_active: z.boolean(),
      year: z.number(),
      month: z.number(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__budgets',
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
          cascadeDelete: true,
          collectionId: 'wallet__categories',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'category',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          max: null,
          min: 0,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: true,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          name: 'rollover_enabled',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          max: null,
          min: 0,
          name: 'rollover_cap',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          maxSize: 2000000,
          name: 'alert_thresholds',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          name: 'is_active',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'year',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'month',
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
  budgets_aggregated: {
    schema: z.object({
      category: z.string(),
      amount: z.number(),
      year: z.number(),
      month: z.number(),
      rollover_enabled: z.boolean(),
      rollover_cap: z.number(),
      alert_thresholds: z.any(),
      is_active: z.boolean(),
      created: z.string(),
      updated: z.string(),
      spent_amount: z.any(),
      rollover_amount: z.any()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'wallet__budgets_aggregated',
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
          cascadeDelete: true,
          collectionId: 'wallet__categories',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'category',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          max: null,
          min: 0,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: true,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'year',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'month',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          name: 'rollover_enabled',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          max: null,
          min: 0,
          name: 'rollover_cap',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          maxSize: 2000000,
          name: 'alert_thresholds',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          name: 'is_active',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
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
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'spent_amount',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          maxSize: 1,
          name: 'rollover_amount',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        "WITH monthly_spent AS (\n  SELECT\n    wallet__transactions_income_expenses.category,\n    CAST(strftime('%Y', wallet__transactions.date) AS INTEGER) AS year,\n    CAST(strftime('%m', wallet__transactions.date) AS INTEGER) - 1 AS month,\n    SUM(wallet__transactions.amount) AS spent_amount\n  FROM wallet__transactions_income_expenses\n  JOIN wallet__transactions \n    ON wallet__transactions_income_expenses.base_transaction = wallet__transactions.id\n  WHERE wallet__transactions_income_expenses.type = 'expenses'\n  GROUP BY \n    wallet__transactions_income_expenses.category,\n    CAST(strftime('%Y', wallet__transactions.date) AS INTEGER),\n    CAST(strftime('%m', wallet__transactions.date) AS INTEGER) - 1\n),\nprev_month_data AS (\n  SELECT\n    b.id AS budget_id,\n    b.amount - COALESCE(ms.spent_amount, 0) AS prev_unspent,\n    b.amount * COALESCE(b.rollover_cap, 100) / 100.0 AS max_rollover,\n    b.rollover_enabled\n  FROM wallet__budgets b\n  LEFT JOIN monthly_spent ms ON (\n    ms.category = b.category\n    AND (\n      (b.month = 0 AND ms.year = b.year - 1 AND ms.month = 11) OR\n      (b.month > 0 AND ms.year = b.year AND ms.month = b.month - 1)\n    )\n  )\n  WHERE b.is_active = 1\n),\nrollover_calc AS (\n  SELECT\n    budget_id,\n    CASE \n      WHEN rollover_enabled = 1 AND prev_unspent > 0 THEN\n        CASE WHEN prev_unspent < max_rollover THEN prev_unspent ELSE max_rollover END\n      ELSE 0 \n    END AS rollover_amount\n  FROM prev_month_data\n)\n  SELECT\n    b.id,\n    b.category,\n    b.amount,\n    b.year,\n    b.month,\n    b.rollover_enabled,\n    b.rollover_cap,\n    b.alert_thresholds,\n    b.is_active,\n    b.created,\n    b.updated,\n    COALESCE(ms.spent_amount, 0) AS spent_amount,\n    COALESCE(rc.rollover_amount, 0) AS rollover_amount\n  FROM wallet__budgets b\n  LEFT JOIN monthly_spent ms ON (\n    ms.category = b.category \n    AND ms.year = b.year \n    AND ms.month = b.month\n  )\n  LEFT JOIN rollover_calc rc ON rc.budget_id = b.id\n  WHERE b.is_active = 1\n"
    }
  },
  savings_goals: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      target_amount: z.number(),
      current_amount: z.number(),
      target_date: z.string(),
      asset: z.string(),
      is_active: z.boolean(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'wallet__savings_goals',
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
          presentable: true,
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
          max: null,
          min: 0,
          name: 'target_amount',
          onlyInt: false,
          presentable: false,
          required: true,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: null,
          min: 0,
          name: 'current_amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          max: '',
          min: '',
          name: 'target_date',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          cascadeDelete: false,
          collectionId: 'wallet__assets',
          hidden: false,
          maxSelect: 1,
          minSelect: 0,
          name: 'asset',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          name: 'is_active',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
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
  }
}

export default cleanSchemas(schemas)
