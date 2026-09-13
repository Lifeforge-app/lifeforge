import { useCallback, useMemo } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle, WithQuery, useModalStore } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { useWalletData } from '@/hooks/useWalletData'

import ModifyCategoryModal from '../../../modals/ModifyCategoryModal'
import CategoriesSectionItem from './CategoriesSectionItem'

function CategoriesSection() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { categoriesQuery } = useWalletData()
  const { type } = useFilter()

  const categories = useMemo(
    () =>
      [
        {
          icon: 'tabler:tag',
          name: 'All Categories',
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
          ({ type: catType }) =>
            type === '' || catType === null || type === catType
        ),
    [categoriesQuery.data, type, t]
  )

  const handleActionButtonClick = useCallback(() => {
    open(ModifyCategoryModal, {
      type: 'create',
      initialData: {
        type: 'expenses'
      }
    })
  }, [])

  return type !== 'transfer' ? (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: handleActionButtonClick
        }}
        label="categories"
      />
      <WithQuery query={categoriesQuery}>
        {() => (
          <>
            {categories.map(
              ({ icon, name, color, id, type: catType, amount }) => (
                <CategoriesSectionItem
                  key={id}
                  amount={amount}
                  color={color}
                  icon={icon}
                  id={id}
                  label={name}
                  type={catType}
                />
              )
            )}
          </>
        )}
      </WithQuery>
    </>
  ) : (
    <></>
  )
}

export default CategoriesSection
