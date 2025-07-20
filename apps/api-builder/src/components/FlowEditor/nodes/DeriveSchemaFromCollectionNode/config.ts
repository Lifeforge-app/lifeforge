import colors from 'tailwindcss/colors'

import DeriveSchemaFromCollectionNode from '.'
import defineNodeConfig from '../../utils/defineConfig'
import { type IDeriveSchemaFromCollectionNodeData } from './types'

export default defineNodeConfig<IDeriveSchemaFromCollectionNodeData>()({
  name: 'Derive Schema From Collection',
  icon: 'tabler:database-export',
  component: DeriveSchemaFromCollectionNode,
  color: colors.blue[500],
  data: {
    collectionName: '',
    name: '',
    typescriptInterfaceName: '',
    fields: []
  },
  handlers: {
    'collection-input': {
      label: 'Collection',
      nodeType: 'collection',
      cardinality: 1,
      filter: {
        handler: ['collection-output']
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
