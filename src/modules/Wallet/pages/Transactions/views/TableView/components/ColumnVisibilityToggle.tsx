import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import { toCamelCase } from '@utils/strings'

function ColumnVisibilityToggle({
  visibleColumn,
  setVisibleColumn
}: {
  visibleColumn: string[]
  setVisibleColumn: React.Dispatch<React.SetStateAction<string[]>>
}): React.ReactElement {
  const { t } = useTranslation()
  return (
    <>
      <SidebarDivider noMargin />
      <span className="flex items-center gap-4 p-4 text-bg-500">
        <Icon icon="tabler:eye" className="size-5" />
        Columns Visibility
      </span>
      <div className="p-4 pt-0">
        <ul className="flex flex-col divide-y divide-bg-700 overflow-hidden rounded-md bg-bg-700/50">
          {[
            'Date',
            'Type',
            'Ledger',
            'Asset',
            'Particulars',
            'Category',
            'Amount',
            'Receipt'
          ].map(column => (
            <MenuItem
              key={column}
              text={t(`table.${toCamelCase(column)}`)}
              onClick={() => {
                if (visibleColumn.includes(column)) {
                  setVisibleColumn(visibleColumn.filter(e => e !== column))
                } else {
                  setVisibleColumn([...visibleColumn, column])
                }
              }}
              isToggled={visibleColumn.includes(column)}
              needTranslate={false}
            />
          ))}
        </ul>
      </div>
    </>
  )
}

export default ColumnVisibilityToggle
