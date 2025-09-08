import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'

import NodeColumn from '../../../components/Node/NodeColumn'
import type { ISchemaField } from '../types'
import FieldColumn from './FieldColumn'

function NodeFragment({ children }: { children: React.ReactNode }) {
  return <Fragment>{children}</Fragment>
}

function FieldsColumn({
  fields,
  withLabel = true,
  withEmptyMessage = true
}: {
  fields: ISchemaField[]
  withLabel?: boolean
  withEmptyMessage?: boolean
}) {
  const { t } = useTranslation('apps.apiBuilder')

  const FinalComponent = withLabel ? NodeColumn : NodeFragment

  return (
    <FinalComponent label="Fields">
      <div className="space-y-1.5">
        {fields.length
          ? fields.map(f => <FieldColumn key={f.name} field={f} />)
          : withEmptyMessage && (
              <p className="text-bg-500 text-center text-sm">
                {t('empty.noFields')}
              </p>
            )}
      </div>
    </FinalComponent>
  )
}

export default FieldsColumn
