import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function TableHeader({
  visibleColumn
}: {
  visibleColumn: string[]
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')

  return (
    <thead>
      <tr className="border-b-2 border-bg-200 text-bg-500 dark:border-bg-800">
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
                {column !== '' && t(`table.${toCamelCase(column)}`)}
              </th>
            )
        )}
      </tr>
    </thead>
  )
}

export default TableHeader
