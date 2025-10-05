import z from 'zod'

const ideaBoxSchemas = {
  containers: {
    schema: z.object({
      icon: z.string(),
      color: z.string(),
      name: z.string(),
      cover: z.string(),
      pinned: z.boolean(),
      hidden: z.boolean()
    }),
    raw: {
      id: '10yi8esudwbgz4n',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'idea_box__containers',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          id: 'raujcrkq',
          max: 0,
          min: 0,
          name: 'icon',
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
          id: 'hvuukigw',
          max: 0,
          min: 0,
          name: 'color',
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
          id: 'spxeebso',
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
          id: 'file2366146245',
          maxSelect: 1,
          maxSize: 0,
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/gif',
            'image/webp'
          ],
          name: 'cover',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: ['0x300'],
          type: 'file'
        },
        {
          hidden: false,
          id: 'bool3844597223',
          name: 'pinned',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          id: 'bool2287856061',
          name: 'hidden',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        }
      ],
      indexes: [
        'CREATE UNIQUE INDEX `idx_pLEjolJLL4` ON `idea_box__containers` (`name`)'
      ],
      system: false
    }
  },
  entries: {
    schema: z.object({
      type: z.enum(['text', 'image', 'link']),
      container: z.string(),
      folder: z.string(),
      pinned: z.boolean(),
      archived: z.boolean(),
      tags: z.any(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      id: 'g5fdcy099cdntzt',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'idea_box__entries',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          id: 'szythmmj',
          maxSelect: 1,
          name: 'type',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['text', 'image', 'link']
        },
        {
          cascadeDelete: true,
          collectionId: '10yi8esudwbgz4n',
          hidden: false,
          id: 'tzxfjxmw',
          maxSelect: 1,
          minSelect: 0,
          name: 'container',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: true,
          collectionId: '5hcu9coxoz9yauz',
          hidden: false,
          id: '6pdlg70r',
          maxSelect: 1,
          minSelect: 0,
          name: 'folder',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          id: '26gry9te',
          name: 'pinned',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          id: 'x9rx6y5a',
          name: 'archived',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          id: 'json1874629670',
          maxSize: 0,
          name: 'tags',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          id: 'autodate2990389176',
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          id: 'autodate3332085495',
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
  folders: {
    schema: z.object({
      container: z.string(),
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      parent: z.string()
    }),
    raw: {
      id: '5hcu9coxoz9yauz',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'idea_box__folders',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          collectionId: '10yi8esudwbgz4n',
          hidden: false,
          id: 'codeuv2z',
          maxSelect: 1,
          minSelect: 0,
          name: 'container',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'cketui8k',
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
          id: 'yft2ibc2',
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
          id: 'yjsyuj9u',
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
          cascadeDelete: true,
          collectionId: '5hcu9coxoz9yauz',
          hidden: false,
          id: '6bvlcx9c',
          maxSelect: 1,
          minSelect: 0,
          name: 'parent',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        }
      ],
      indexes: [],
      system: false
    }
  },
  tags: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      container: z.string()
    }),
    raw: {
      id: 'pbc_180691175',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'idea_box__tags',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          id: 'text1579384326',
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
          id: 'text1704208859',
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
          id: 'text1716930793',
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
          cascadeDelete: true,
          collectionId: '10yi8esudwbgz4n',
          hidden: false,
          id: 'relation3349343259',
          maxSelect: 1,
          minSelect: 0,
          name: 'container',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        }
      ],
      indexes: [
        'CREATE UNIQUE INDEX `idx_VY136WXYHm` ON `idea_box_tags` (\n  `name`,\n  `container`\n)'
      ],
      system: false
    }
  },
  tags_aggregated: {
    schema: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      container: z.string(),
      amount: z.number()
    }),
    raw: {
      id: 'pbc_3145449922',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'idea_box__tags_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text3208210256',
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
          id: '_clone_Hvdl',
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
          id: '_clone_Npv3',
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
          id: '_clone_cvMl',
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
          cascadeDelete: true,
          collectionId: '10yi8esudwbgz4n',
          hidden: false,
          id: '_clone_X9hN',
          maxSelect: 1,
          minSelect: 0,
          name: 'container',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          id: 'number2392944706',
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
        'WITH entry_tag_map AS (\n  SELECT\n    idea_box__entries.id AS entry_id,\n    idea_box__entries.container as entry_container,\n    json_each.value AS tag_name\n  FROM\n    idea_box__entries,\n    json_each(idea_box__entries.tags)\n  WHERE\n    idea_box__entries.archived = FALSE\n)\nSELECT \n  idea_box__tags.id,\n  idea_box__tags.name,\n  idea_box__tags.color,\n  idea_box__tags.icon,\n  idea_box__tags.container,\n  count(entry_tag_map.entry_id) as amount\nFROM \n  idea_box__tags\nLEFT JOIN entry_tag_map \n  ON entry_tag_map.tag_name = idea_box__tags.name\n  AND entry_tag_map.entry_container = idea_box__tags.container\nGROUP BY \n  idea_box__tags.id'
    }
  },
  containers_aggregated: {
    schema: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      cover: z.string(),
      pinned: z.boolean(),
      hidden: z.boolean(),
      text_count: z.number(),
      link_count: z.number(),
      image_count: z.number()
    }),
    raw: {
      id: 'pbc_3754909733',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'idea_box__containers_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text3208210256',
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
          id: '_clone_0lJw',
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
          autogeneratePattern: '',
          hidden: false,
          id: '_clone_IxCk',
          max: 0,
          min: 0,
          name: 'color',
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
          id: '_clone_dztZ',
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: '_clone_v8GV',
          maxSelect: 1,
          maxSize: 0,
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/gif',
            'image/webp'
          ],
          name: 'cover',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: ['0x300'],
          type: 'file'
        },
        {
          hidden: false,
          id: '_clone_WQOF',
          name: 'pinned',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          id: '_clone_dcAp',
          name: 'hidden',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          id: 'number3547201087',
          max: null,
          min: null,
          name: 'text_count',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          id: 'number711071932',
          max: null,
          min: null,
          name: 'link_count',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          id: 'number2459746507',
          max: null,
          min: null,
          name: 'image_count',
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
        "SELECT\n  idea_box__containers.id,\n  idea_box__containers.name,\n  idea_box__containers.color,\n  idea_box__containers.icon,\n  idea_box__containers.cover,\n  idea_box__containers.pinned,\n  idea_box__containers.hidden,\n  COUNT(CASE WHEN idea_box__entries.type = 'text' THEN 1 END) AS text_count,\n  COUNT(CASE WHEN idea_box__entries.type = 'link' THEN 1 END) AS link_count,\n  COUNT(CASE WHEN idea_box__entries.type = 'image' THEN 1 END) AS image_count\nFROM idea_box__containers\nLEFT JOIN idea_box__entries\n  ON idea_box__entries.container = idea_box__containers.id\n  AND idea_box__entries.archived = false\nGROUP BY idea_box__containers.id\n"
    }
  },
  entries_text: {
    schema: z.object({
      base_entry: z.string(),
      content: z.string()
    }),
    raw: {
      id: 'pbc_3433603498',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'idea_box__entries_text',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          collectionId: 'g5fdcy099cdntzt',
          hidden: false,
          id: 'relation2517240994',
          maxSelect: 1,
          minSelect: 0,
          name: 'base_entry',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text4274335913',
          max: 0,
          min: 0,
          name: 'content',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text'
        }
      ],
      indexes: [],
      system: false
    }
  },
  entries_link: {
    schema: z.object({
      link: z.url(),
      base_entry: z.string()
    }),
    raw: {
      id: 'pbc_3247415196',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'idea_box__entries_link',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          exceptDomains: null,
          hidden: false,
          id: 'url917281265',
          name: 'link',
          onlyDomains: null,
          presentable: false,
          required: true,
          system: false,
          type: 'url'
        },
        {
          cascadeDelete: true,
          collectionId: 'g5fdcy099cdntzt',
          hidden: false,
          id: 'relation2632451253',
          maxSelect: 1,
          minSelect: 0,
          name: 'base_entry',
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
  entries_image: {
    schema: z.object({
      image: z.string(),
      base_entry: z.string()
    }),
    raw: {
      id: 'pbc_4140382908',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'idea_box__entries_image',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
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
          id: 'file3309110367',
          maxSelect: 1,
          maxSize: 9999999999,
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/gif',
            'image/webp'
          ],
          name: 'image',
          presentable: false,
          protected: false,
          required: true,
          system: false,
          thumbs: [],
          type: 'file'
        },
        {
          cascadeDelete: true,
          collectionId: 'g5fdcy099cdntzt',
          hidden: false,
          id: 'relation2632451253',
          maxSelect: 1,
          minSelect: 0,
          name: 'base_entry',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        }
      ],
      indexes: [],
      system: false
    }
  }
}

export default ideaBoxSchemas
