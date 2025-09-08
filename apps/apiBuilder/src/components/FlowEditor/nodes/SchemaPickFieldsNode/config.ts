import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import SchemaPickFieldsNode from './index'
import { type IPickFieldsFromSchemaNodeData } from './types'

export default defineNodeConfig<IPickFieldsFromSchemaNodeData>()({
  name: 'Pick Fields From Schema',
  icon: 'tabler:checklist',
  component: SchemaPickFieldsNode,
  color: colors.blue[500],
  data: {
    fieldIds: [],
    fields: []
  },
  handlers: {
    'schema-input': {
      label: 'Schema',
      nodeType: 'schema',
      cardinality: 1,
      filter: {
        handler: ['schema-output'],
        node: ['schema', 'schemaWithPB', 'deriveSchemaFromCollection']
      }
    },
    'schema-output': {
      label: 'Schema',
      nodeType: 'schema',
      cardinality: 'many',
      filter: {
        handler: ['schema-input']
      }
    }
  }
} as const)
