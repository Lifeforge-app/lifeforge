import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import CollectionNode from './index'
import { type ICollectionNodeData } from './types'

export default defineNodeConfig<ICollectionNodeData>()({
  name: 'Collection',
  icon: 'tabler:folder',
  component: CollectionNode,
  color: colors.sky[500],
  data: {
    name: '',
    type: 'base',
    fields: []
  },
  handlers: {
    'collection-output': {
      label: 'Collection',
      nodeType: 'collection',
      cardinality: 'many',
      filter: {
        handler: ['collection-input']
      }
    }
  }
})
