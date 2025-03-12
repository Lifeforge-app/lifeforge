import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

function TableHeader({
  visibleColumn
}: {
  visibleColumn: string[]
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')

  return (
    <thead>
      <tr className="border-bg-200 text-bg-500 dark:border-bg-800 border-b-2">
        {[
          'Date',
          'Type',
          'Ledger',
          'Asset',
          'Particulars',
          'Location',
          'Category',
          'Amount',
          'Receipt',
          ''
        ].map(
          column =>
            (visibleColumn.includes(column) || column === '') && (
              <th
                key={column}
                className={clsx(
                  'p-2 font-medium',
                  column === 'Particulars' && 'text-left'
                )}
              >
                {column !== '' && t(`table.${_.camelCase(column)}`)}
              </th>
            )
        )}
      </tr>
    </thead>
  )
}

export default TableHeader
