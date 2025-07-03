import { Icon } from '@iconify/react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useModalStore } from '@lifeforge/ui'

import { IIdeaBoxContainer } from '@apps/IdeaBox/interfaces/ideabox_interfaces'

import ModifyContainerModal from '../ModifyContainerModal'
import ContainerItem from './components/ContainerItem'

function ContainerList({
  filteredList
}: {
  filteredList: IIdeaBoxContainer[]
}) {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation(['apps.ideaBox', 'common.buttons'])

  const handleCreateContainer = useCallback(() => {
    open(ModifyContainerModal, {
      type: 'create',
      existedData: null
    })
  }, [])

  return (
    <div className="mt-6 grid w-full grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-6 px-3 pb-12">
      {filteredList.map(container => (
        <ContainerItem key={container.id} container={container} />
      ))}
      <button
        className="flex-center border-bg-400 hover:bg-bg-200 dark:border-bg-700 dark:hover:bg-bg-800/20 relative h-full flex-col gap-6 rounded-lg border-2 border-dashed p-8"
        onClick={handleCreateContainer}
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

export default ContainerList
