import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import CollectionPickFieldsNode from './index'
import type { ICollectionPickFieldsNodeData } from './types'

export default defineNodeConfig<ICollectionPickFieldsNodeData>()({
  name: 'Collection Pick Fields',
  icon: 'tabler:checklist',
  component: CollectionPickFieldsNode,
  color: colors.purple[500],
  data: {
    fieldIds: [],
    fields: []
  },
  handlers: {
    'collection-pick-fields-output': {
      label: 'Collection Pick Fields',
      nodeType: 'collectionPickFields',
      cardinality: 1,
      filter: {
        handler: ['collection-pick-fields-input']
      }
    }
  }
} as const)
