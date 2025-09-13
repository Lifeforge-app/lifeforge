import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import SchemaNode from './index'
import { type ISchemaNodeData } from './types'

export default defineNodeConfig<ISchemaNodeData>()({
  name: 'Schema',
  icon: 'solar:structure-outline',
  component: SchemaNode,
  color: colors.blue[500],
  data: {
    name: 'NewSchema',
    fields: []
  },
  handlers: {
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
