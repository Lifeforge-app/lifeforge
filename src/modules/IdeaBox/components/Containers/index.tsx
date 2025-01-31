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
  const { t } = useTranslation()

  return (
    <div className="mt-6 grid w-full grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-6 px-3 pb-12">
      {filteredList.map(container => (
        <ContainerItem
          key={container.id}
          container={container}
          setCreateContainerModalOpen={setCreateContainerModalOpen}
          setExistedData={setExistedData}
          setDeleteContainerConfirmationModalOpen={
            setDeleteContainerConfirmationModalOpen
          }
        />
      ))}
      <button
        onClick={() => {
          setCreateContainerModalOpen('create')
        }}
        className="flex-center relative h-full flex-col gap-6 rounded-lg border-2 border-dashed border-bg-400 p-8 hover:bg-bg-200 dark:border-bg-700 dark:hover:bg-bg-800/20"
      >
        <Icon
          icon="tabler:cube-plus"
          className="size-8 text-bg-500 dark:text-bg-50"
        />
        <div className="text-xl font-semibold text-bg-500 dark:text-bg-50">
          {t('buttons.createContainer')}
        </div>
      </button>
    </div>
  )
}

export default Container
