import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import ControllerNode from './index'

export default defineNodeConfig()({
  name: 'Controller',
  icon: 'tabler:settings',
  component: ControllerNode,
  color: colors.green[500],
  handlers: {
    'route-input': {
      label: 'Route',
      nodeType: 'route',
      cardinality: 'many',
      filter: {
        handler: ['route-output']
      }
    },
    'request-schema-input': {
      label: 'Request Schema',
      nodeType: 'requestSchema',
      cardinality: 1,
      filter: {
        handler: ['request-schema-output']
      },
      optional: true
    },
    'response-schema-input': {
      label: 'Response Schema',
      nodeType: 'schema',
      cardinality: 1,
      filter: {
        handler: ['schema-output']
      },
      optional: true
    },
    'controller-output': {
      label: 'Controller',
      nodeType: 'controller',
      cardinality: 1,
      filter: {
        handler: ['controller-input']
      },
      isWayToController: true
    }
  }
} as const)
