import z from 'zod'

const railwayMapSchemas = {
  lines: {
    schema: z.object({
      country: z.string(),
      type: z.string(),
      code: z.string(),
      name: z.string(),
      color: z.string(),
      ways: z.any(),
      map_paths: z.any()
    }),
    raw: {
      id: 'pbc_1897454554',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'railway_map__lines',
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
          id: 'text1400097126',
          max: 0,
          min: 0,
          name: 'country',
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
          id: 'text2363381545',
          max: 0,
          min: 0,
          name: 'type',
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
          id: 'text1997877400',
          max: 0,
          min: 0,
          name: 'code',
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
          hidden: false,
          id: 'json2840069143',
          maxSize: 0,
          name: 'ways',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          id: 'json189581693',
          maxSize: 0,
          name: 'map_paths',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        }
      ],
      indexes: [],
      system: false
    }
  },
  stations: {
    schema: z.object({
      name: z.string(),
      desc: z.string(),
      lines: z.array(z.string()),
      codes: z.any(),
      coords: z.any(),
      map_data: z.any(),
      type: z.string(),
      distances: z.any(),
      map_image: z.string()
    }),
    raw: {
      id: 'pbc_1340498464',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'railway_map__stations',
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
          id: 'text196455508',
          max: 0,
          min: 0,
          name: 'desc',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          cascadeDelete: true,
          collectionId: 'pbc_1897454554',
          hidden: false,
          id: 'relation1325501590',
          maxSelect: 999,
          minSelect: 0,
          name: 'lines',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          id: 'json3853369677',
          maxSize: 0,
          name: 'codes',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          id: 'json3631081861',
          maxSize: 0,
          name: 'coords',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          id: 'json2632528569',
          maxSize: 0,
          name: 'map_data',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text2363381545',
          max: 0,
          min: 0,
          name: 'type',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'json2175659559',
          maxSize: 0,
          name: 'distances',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          id: 'file1170950963',
          maxSelect: 1,
          maxSize: 0,
          mimeTypes: [],
          name: 'map_image',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: [],
          type: 'file'
        }
      ],
      indexes: [],
      system: false
    }
  }
}

export default railwayMapSchemas
