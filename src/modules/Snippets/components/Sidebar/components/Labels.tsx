/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react'
import SidebarTitle from '../../../../../components/Sidebar/components/SidebarTitle'
import { Icon } from '@iconify/react/dist/iconify.js'
import ModifyLabelModal from '../../ModifyLabelModal'
import APIComponentWithFallback from '../../../../../components/general/APIComponentWithFallback'

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
  const [existedData] = useState<ICodeSnippetsLabel | null>(null)

  return (
    <>
      <SidebarTitle
        name="labels"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyLabelModalOpenType('create')
        }}
      />
      <APIComponentWithFallback data={labels}>
        {typeof labels !== 'string' &&
          labels.map(item => (
            <li
              key={item.id}
              className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
            >
              <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800">
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
          ))}
      </APIComponentWithFallback>
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
