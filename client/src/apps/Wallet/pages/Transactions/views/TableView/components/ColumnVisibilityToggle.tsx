import {
  HamburgerMenuSelectorWrapper,
  MenuItem,
  SidebarDivider
} from 'lifeforge-ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

function ColumnVisibilityToggle({
  visibleColumn,
  setVisibleColumn
}: {
  visibleColumn: string[]
  setVisibleColumn: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const { t } = useTranslation('apps.wallet')

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
            text={t(`table.${_.camelCase(column)}`)}
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
