import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'
import ContainerItem from './components/ContainerItem'

function Container({
  filteredList,
  setCreateContainerModalOpen,
  setExistedData,
  setDeleteContainerConfirmationModalOpen
}: {
  filteredList: IIdeaBoxContainer[]
  setCreateContainerModalOpen: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IIdeaBoxContainer | null>>
  setDeleteContainerConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  const { t } = useTranslation(['modules.ideaBox', 'common.buttons'])

  return (
    <div className="mt-6 grid w-full grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-6 px-3 pb-12">
      {filteredList.map(container => (
        <ContainerItem
          key={container.id}
          container={container}
          setCreateContainerModalOpen={setCreateContainerModalOpen}
          setDeleteContainerConfirmationModalOpen={
            setDeleteContainerConfirmationModalOpen
          }
          setExistedData={setExistedData}
        />
      ))}
      <button
        className="flex-center border-bg-400 hover:bg-bg-200 dark:border-bg-700 dark:hover:bg-bg-800/20 relative h-full flex-col gap-6 rounded-lg border-2 border-dashed p-8"
        onClick={() => {
          setCreateContainerModalOpen('create')
        }}
      >
        <Icon
          className="text-bg-500 dark:text-bg-50 size-8"
          icon="tabler:cube-plus"
        />
        <div className="text-bg-500 dark:text-bg-50 text-xl font-semibold">
          {t('common.buttons:new', { item: t('items.container') })}
        </div>
      </button>
    </div>
  )
}

export default Container
