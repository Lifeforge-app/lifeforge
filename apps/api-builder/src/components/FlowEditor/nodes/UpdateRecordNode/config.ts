import colors from 'tailwindcss/colors'

import UpdateRecordNode from '.'
import defineNodeConfig from '../../utils/defineConfig'

export default defineNodeConfig()({
  name: 'Update Record',
  icon: 'tabler:pencil',
  component: UpdateRecordNode,
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
    'field-value-input': {
      dynamic: true,
      label: 'Value',
      nodeType: 'value',
      cardinality: 1,
      filter: {
        handler: ['value-output']
      },
      isWayToController: true
    },
    'db-operation-output': {
      label: 'Database Action',
      nodeType: 'updateRecord',
      cardinality: 1,
      filter: {
        handler: ['db-operation-input']
      },
      isWayToController: true
    }
  }
} as const)
