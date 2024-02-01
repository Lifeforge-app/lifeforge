/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { type IIdeaBoxContainer } from '../..'
import ContainerItem from './components/ContainerItem'
import { Icon } from '@iconify/react/dist/iconify.js'

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
        className="relative flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-neutral-400 p-8 hover:bg-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800/20"
      >
        <Icon
          icon="tabler:cube-plus"
          className="h-8 w-8 text-neutral-400 dark:text-neutral-100"
        />
        <div className="text-xl font-semibold text-neutral-400 dark:text-neutral-100">
          Create container
        </div>
      </button>
    </div>
  )
}

export default Container
