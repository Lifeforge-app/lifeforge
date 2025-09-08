import colors from 'tailwindcss/colors'

import defineNodeConfig from '../../utils/defineConfig'
import DatabaseCRUDActionNode from './index'

export default defineNodeConfig()({
  name: 'Database CRUD Action',
  icon: 'tabler:database',
  component: DatabaseCRUDActionNode,
  color: colors.green[500],
  handlers: {
    'db-operation-input': {
      label: 'Database Action',
      nodeType: 'getFullList',
      cardinality: 1,
      filter: {
        handler: ['db-operation-output']
      },
      isWayToController: true
    },
    'action-output': {
      label: 'Action',
      nodeType: 'databaseCRUDAction',
      cardinality: 1,
      filter: {
        handler: ['action-input']
      },
      isWayToController: true
    }
  }
} as const)
