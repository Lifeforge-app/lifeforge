import { SidebarTitle, WithQuery } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useWalletData } from '@apps/03.Finance/wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/03.Finance/wallet/stores/useWalletStore'

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
          type: null as 'income' | 'expenses' | null,
          amount: undefined as number | undefined,
          id: null as string | null
        }
      ]
        .concat(
          categoriesQuery.data?.sort(
            (a, b) =>
              ['income', 'expenses'].indexOf(a.type) -
              ['income', 'expenses'].indexOf(b.type)
          ) ?? []
        )
        .filter(
          ({ type }) => selectedType === type || (selectedType ?? null) === null
        ),
    [categoriesQuery.data, selectedType, t]
  )

  const handleActionButtonClick = useCallback(() => {
    open(ModifyCategoryModal, {
      type: 'create',
      initialData: {
        type: 'expenses'
      }
    })
  }, [])

  return selectedType !== 'transfer' ? (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={handleActionButtonClick}
        label={t('sidebar.categories')}
      />
      <WithQuery query={categoriesQuery}>
        {() => (
          <>
            {categories.map(({ icon, name, color, id, type, amount }) => (
              <CategoriesSectionItem
                key={id}
                amount={amount}
                color={color}
                icon={icon}
                id={id}
                label={name}
                type={type}
              />
            ))}
          </>
        )}
      </WithQuery>
    </>
  ) : (
    <></>
  )
}

export default CategoriesSection
