/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { type IIdeaBoxContainer } from '../..'
import ContainerGridItem from './ContainerGridItem'
import { Icon } from '@iconify/react/dist/iconify.js'

function ContainerGrid({
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
    <div className="mt-6 grid w-full grid-cols-4 gap-6 overflow-y-auto pb-12">
      {filteredList.map(container => (
        <ContainerGridItem
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
        className="relative flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-neutral-700 p-8 hover:bg-neutral-800/20"
      >
        <Icon icon="tabler:cube-plus" className="h-8 w-8 text-neutral-500" />
        <div className="text-xl font-semibold text-neutral-500">
          Create container
        </div>
      </button>
    </div>
  )
}

export default ContainerGrid
