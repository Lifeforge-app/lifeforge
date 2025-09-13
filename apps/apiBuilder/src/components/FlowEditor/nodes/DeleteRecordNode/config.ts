import colors from 'tailwindcss/colors'

import DeleteRecordNode from '.'
import defineNodeConfig from '../../utils/defineConfig'

export default defineNodeConfig()({
  name: 'Delete Record',
  icon: 'tabler:trash',
  component: DeleteRecordNode,
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
    'id-input': {
      label: 'Record ID',
      nodeType: 'value',
      cardinality: 1,
      filter: {
        handler: ['value-output']
      },
      isWayToController: true
    },
    'db-operation-output': {
      label: 'Database Action',
      nodeType: 'deleteRecord',
      cardinality: 1,
      filter: {
        handler: ['db-operation-input']
      },
      isWayToController: true
    }
  }
} as const)
