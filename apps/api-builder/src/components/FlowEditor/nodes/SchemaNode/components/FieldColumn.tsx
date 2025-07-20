import { Icon } from '@iconify/react/dist/iconify.js'
import { Fragment } from 'react/jsx-runtime'

import NodeColumnValueWrapper from '../../../components/Node/NodeColumnValueWrapper'
import FIELD_TYPES from '../constants/field_types'
import type { ISchemaField } from '../types'

function FieldColumn({
  field,
  withWrapper = true,
  rightComponent
}: {
  field: ISchemaField
  withWrapper?: boolean
  rightComponent?: React.ReactNode
}) {
  const FinalComponent = withWrapper ? NodeColumnValueWrapper : Fragment

  return (
    <FinalComponent>
      <div className="flex-between w-full gap-3">
        <span className="flex items-center gap-2">
          <Icon
            icon={
              FIELD_TYPES.find(t => t.label.toLowerCase() === field.type)
                ?.icon || 'tabler:abc'
            }
            className="text-bg-500 size-4"
          />
          {field.name}
        </span>
        {rightComponent || (
          <span className="text-bg-500">
            {field.type}
            {field.isOptional ? '?' : ''}
          </span>
        )}
      </div>
    </FinalComponent>
  )
}

export default FieldColumn
