import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import CategoriesSectionItem from './CategoriesSectionItem'

function CategoriesSection() {
  const { t } = useTranslation('apps.wallet')
  const { categoriesQuery } = useWalletData()
  const { selectedType, setManageCategoriesModalOpen } = useWalletStore()

  const handleActionButtonClick = useCallback(() => {
    setManageCategoriesModalOpen('new')
  }, [setManageCategoriesModalOpen])

  return selectedType !== 'transfer' ? (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={handleActionButtonClick}
        name={t('sidebar.categories')}
      />
      <QueryWrapper query={categoriesQuery}>
        {categories => (
          <>
            {[
              {
                icon: 'tabler:tag',
                name: t('sidebar.allCategories'),
                color: 'white',
                id: null,
                type: null
              }
            ]
              .concat(
                categories.sort(
                  (a, b) =>
                    ['income', 'expenses'].indexOf(a.type) -
                    ['income', 'expenses'].indexOf(b.type)
                ) as any
              )
              .filter(
                ({ type }) =>
                  selectedType === type || (selectedType ?? null) === null
              )
              .map(({ icon, name, color, id, type }) => (
                <CategoriesSectionItem
                  key={id}
                  color={color}
                  icon={icon}
                  id={id}
                  name={name}
                  type={type}
                />
              ))}
          </>
        )}
      </QueryWrapper>
    </>
  ) : (
    <></>
  )
}

export default CategoriesSection
