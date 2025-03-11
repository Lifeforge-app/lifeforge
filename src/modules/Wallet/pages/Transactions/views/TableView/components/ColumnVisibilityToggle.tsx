import { toCamelCase } from '@utils/strings'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  HamburgerMenuSelectorWrapper,
  MenuItem,
  SidebarDivider
} from '@lifeforge/ui'

function ColumnVisibilityToggle({
  visibleColumn,
  setVisibleColumn
}: {
  visibleColumn: string[]
  setVisibleColumn: React.Dispatch<React.SetStateAction<string[]>>
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
  return (
    <>
      <SidebarDivider noMargin />
      <HamburgerMenuSelectorWrapper
        icon="tabler:eye"
        title={t('Columns Visibility')}
      >
        {[
          'Date',
          'Type',
          'Ledger',
          'Asset',
          'Particulars',
          'Location',
          'Category',
          'Amount',
          'Receipt'
        ].map(column => (
          <MenuItem
            key={column}
            isToggled={visibleColumn.includes(column)}
            text={t(`table.${toCamelCase(column)}`)}
            onClick={() => {
              if (visibleColumn.includes(column)) {
                setVisibleColumn(visibleColumn.filter(e => e !== column))
              } else {
                setVisibleColumn([...visibleColumn, column])
              }
            }}
          />
        ))}
      </HamburgerMenuSelectorWrapper>
    </>
  )
}

export default ColumnVisibilityToggle
