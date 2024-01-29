/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react'
import SidebarTitle from '../../../../components/Sidebar/components/SidebarTitle'
import { Icon } from '@iconify/react/dist/iconify.js'
import ModifyLabelModal from '../ModifyLabelModal'

export interface ICodeSnippetsLabel {
  collectionId: string
  collectionName: string
  color: string
  created: string
  id: string
  item_count: number
  name: string
  updated: string
}

function Labels({
  labels,
  updateLabelList
}: {
  labels: ICodeSnippetsLabel[] | 'error' | 'loading'
  updateLabelList: () => void
}): React.ReactElement {
  const [modifyLabelModalOpenType, setModifyLabelModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedData, setExistedData] = useState<ICodeSnippetsLabel | null>(
    null
  )

  return (
    <>
      <SidebarTitle
        name="labels"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyLabelModalOpenType('create')
        }}
      />
      {(() => {
        switch (labels) {
          case 'loading':
            return (
              <div className="flex items-center justify-center gap-2 px-8 sm:px-12 py-2">
                <span className="small-loader-light" />
              </div>
            )
          case 'error':
            return (
              <div className="flex items-center justify-center gap-2 px-8 sm:px-12 py-2 text-red-500">
                <Icon icon="tabler:alert-triangle" className="h-5 w-5" />
                <span>Failed to fetch data.</span>
              </div>
            )
          default:
            return labels.map(item => (
              <li
                key={item.id}
                className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <span
                    className="block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex w-full items-center justify-between">
                    {item.name}
                  </div>
                  <span className="text-sm">{item.item_count}</span>
                </div>
              </li>
            ))
        }
      })()}
      <ModifyLabelModal
        openType={modifyLabelModalOpenType}
        setOpenType={setModifyLabelModalOpenType}
        existedData={existedData}
        updateLabelList={updateLabelList}
      />
    </>
  )
}

export default Labels
