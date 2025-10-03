import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import SchemaArrayNode from './index'

export default defineNodeConfig()({
  name: 'Schema Array',
  icon: 'tabler:list',
  component: SchemaArrayNode,
  color: colors.blue[500],
  handlers: {
    'schema-input': {
      label: 'Schema',
      nodeType: 'schema',
      cardinality: 1,
      filter: {
        handler: ['schema-output'],
        node: ['schemaPickFields', 'schema', 'schemaWithPB']
      }
    },
    'schema-output': {
      label: 'Schema',
      nodeType: 'schema',
      cardinality: 'many',
      filter: {
        handler: ['schema-input'],
        node: ['requestSchema', 'controller']
      }
    }
  }
} as const)
