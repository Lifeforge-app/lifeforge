import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import { type ISchemaNodeData } from '../SchemaNode/types'
import WithPBNode from './index'

export default defineNodeConfig<ISchemaNodeData>()({
  name: 'With PocketBase Schema',
  icon: 'simple-icons:pocketbase',
  component: WithPBNode,
  color: colors.blue[500],
  data: {
    name: '',
    fields: []
  },
  handlers: {
    'schema-input': {
      label: 'Schema',
      nodeType: 'schema',
      cardinality: 1,
      filter: {
        handler: ['schema-output'],
        node: ['schemaPickFields', 'schema', 'deriveSchemaFromCollection']
      }
    },
    'schema-output': {
      label: 'Schema',
      nodeType: 'schema',
      cardinality: 'many',
      filter: {
        handler: ['schema-input'],
        node: ['schemaArray', 'schemaPickFields', 'requestSchema', 'controller']
      }
    }
  }
} as const)
