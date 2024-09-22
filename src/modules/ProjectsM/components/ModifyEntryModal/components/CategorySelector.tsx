import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxNullOption'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
import { type IProjectsMCategory } from '@interfaces/projects_m_interfaces'

function CategorySelector({
  category,
  setCategory,
  categories
}: {
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
  categories: IProjectsMCategory[] | 'loading' | 'error'
}): React.ReactElement {
  const { t } = useTranslation()

  if (categories === 'loading') {
    return <div>Loading...</div>
  }

  if (categories === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxInput
      name={t('input.projectCategory')}
      icon="tabler:apps"
      value={category}
      setValue={setCategory}
      buttonContent={
        <>
          <Icon
            icon={
              categories.find(l => l.id === category)?.icon ?? 'tabler:apps-off'
            }
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {categories.find(l => l.id === category)?.name ?? 'None'}
          </span>
        </>
      }
    >
      <ListboxNullOption icon="tabler:apps-off" />
      {categories.map(({ name, id, icon }, i) => (
        <ListboxOption key={i} value={id} text={name} icon={icon} />
      ))}
    </ListboxInput>
  )
}

export default CategorySelector
