import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import FilterNode from './index'
import type { IFilterNodeData } from './types'

export default defineNodeConfig<IFilterNodeData>()({
  name: 'Filter',
  icon: 'tabler:filter',
  component: FilterNode,
  color: colors.purple[500],
  data: {
    columnName: '',
    comparator: ''
  },
  handlers: {
    'value-input': {
      label: 'Value',
      nodeType: 'value',
      cardinality: 1,
      filter: {
        handler: ['value-output']
      },
      isWayToController: true
    },
    'filter-output': {
      label: 'Filter',
      nodeType: 'filter',
      cardinality: 1,
      filter: {
        handler: ['filter-input']
      },
      isWayToController: true
    }
  }
} as const)
