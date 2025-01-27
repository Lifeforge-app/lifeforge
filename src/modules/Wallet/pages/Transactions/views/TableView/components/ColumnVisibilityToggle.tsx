import React from 'react'
import { useTranslation } from 'react-i18next'
import HamburgerSelectorWrapper from '@components/buttons/HamburgerMenu/components/HamburgerSelectorWrapper'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SidebarDivider } from '@components/layouts/sidebar'
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
      <HamburgerSelectorWrapper
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
      </HamburgerSelectorWrapper>
    </>
  )
}

export default ColumnVisibilityToggle
