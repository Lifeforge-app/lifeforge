import { QueryWrapper, SidebarTitle } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import ModifyCategoryModal from '../../../modals/ModifyCategoryModal'
import CategoriesSectionItem from './CategoriesSectionItem'

function CategoriesSection() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const { categoriesQuery } = useWalletData()

  const { selectedType } = useWalletStore()

  const categories = useMemo(
    () =>
      [
        {
          icon: 'tabler:tag',
          name: t('sidebar.allCategories'),
          color: 'white',
          id: null,
          type: null,
          amount: undefined
        }
      ]
        .concat(
          categoriesQuery.data?.sort(
            (a, b) =>
              ['income', 'expenses'].indexOf(a.type) -
              ['income', 'expenses'].indexOf(b.type)
          ) ?? ([] as any)
        )
        .filter(
          ({ type }) => selectedType === type || (selectedType ?? null) === null
        ),
    [categoriesQuery.data, selectedType, t]
  )

  const handleActionButtonClick = useCallback(() => {
    open(ModifyCategoryModal, {
      type: 'income',
      initialData: null
    })
  }, [])

  return selectedType !== 'transfer' ? (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={handleActionButtonClick}
        name={t('sidebar.categories')}
      />
      <QueryWrapper query={categoriesQuery}>
        {() => (
          <>
            {categories.map(({ icon, name, color, id, type, amount }) => (
              <CategoriesSectionItem
                key={id}
                amount={amount}
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
