import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import GetFullListNode from './index'

export default defineNodeConfig()({
  name: 'Get Full List',
  icon: 'tabler:list-search',
  component: GetFullListNode,
  color: colors.sky[500],
  handlers: {
    'collection-input': {
      label: 'Collection',
      nodeType: 'collection',
      cardinality: 1,
      filter: {
        handler: ['collection-output']
      }
    },
    'filter-input': {
      label: 'Filter',
      nodeType: 'filter',
      cardinality: 1,
      filter: {
        handler: ['filter-output']
      },
      isWayToController: true
    },
    'sorter-input': {
      label: 'Sorter',
      nodeType: 'sorter',
      cardinality: 'many',
      filter: {
        handler: ['sorter-output']
      },
      isWayToController: true
    },
    'collection-pick-fields-input': {
      label: 'Collection Pick Fields',
      nodeType: 'collectionPickFields',
      cardinality: 1,
      filter: {
        handler: ['collection-pick-fields-output']
      }
    },
    'db-operation-output': {
      label: 'Database Action',
      nodeType: 'getFullList',
      cardinality: 1,
      filter: {
        handler: ['db-operation-input']
      },
      isWayToController: true
    }
  }
} as const)
