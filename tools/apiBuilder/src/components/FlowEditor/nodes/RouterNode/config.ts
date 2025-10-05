import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import RouterNode from './index'
import { type IRouterNodeData } from './types'

export default defineNodeConfig<IRouterNodeData>()({
  name: 'Router',
  icon: 'tabler:router',
  component: RouterNode,
  color: colors.orange[500],
  data: {
    parentPath: '',
    path: ''
  },
  handlers: {
    'router-input': {
      label: 'Router',
      nodeType: 'router',
      cardinality: 1,
      filter: {
        handler: ['router-output']
      }
    },
    'router-output': {
      label: 'Router',
      nodeType: 'route',
      cardinality: 'many',
      filter: {
        handler: ['route-input']
      }
    }
  }
} as const)
