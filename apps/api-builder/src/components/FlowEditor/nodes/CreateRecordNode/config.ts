import colors from 'tailwindcss/colors'

import CreateRecordNode from '.'
import defineNodeConfig from '../../utils/defineConfig'

export default defineNodeConfig()({
  name: 'Create Record',
  icon: 'tabler:plus',
  component: CreateRecordNode,
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
      nodeType: 'createRecord',
      cardinality: 1,
      filter: {
        handler: ['db-operation-input']
      },
      isWayToController: true
    }
  }
})
