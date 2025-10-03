import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import SorterNode from './index'
import type { ISorterNodeData } from './types'

export default defineNodeConfig<ISorterNodeData>()({
  name: 'Sorter',
  icon: 'tabler:sort-ascending',
  component: SorterNode,
  color: colors.purple[500],
  data: {
    field: '',
    direction: 'asc'
  },
  handlers: {
    'sorter-output': {
      label: 'Sorter',
      nodeType: 'sorter',
      cardinality: 1,
      filter: {
        handler: ['sorter-input']
      }
    }
  }
} as const)
