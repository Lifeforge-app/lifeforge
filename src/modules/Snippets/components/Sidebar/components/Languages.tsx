/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import SidebarTitle from '../../../../../components/Sidebar/components/SidebarTitle'
import APIComponentWithFallback from '../../../../../components/general/APIComponentWithFallback'

export interface ICodeSnippetsLanguage {
  collectionId: string
  collectionName: string
  color: string
  created: string
  icon: string
  id: string
  item_count: number
  name: string
  updated: string
}

function Languages({
  languages,
  updateLanguageList
}: {
  languages: ICodeSnippetsLanguage[] | 'error' | 'loading'
  updateLanguageList: () => void
}): React.ReactElement {
  return (
    <>
      <SidebarTitle name="languages" actionButtonIcon="tabler:plus" />
      <APIComponentWithFallback data={languages}>
        {typeof languages !== 'string' &&
          languages.map(item => (
            <li
              key={item.id}
              className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
            >
              <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800">
                <Icon icon={item.icon} className="h-5 w-5 shrink-0" />
                <div className="flex w-full items-center justify-between">
                  {item.name}
                </div>
                <span className="text-sm">{item.item_count}</span>
              </div>
            </li>
          ))}
      </APIComponentWithFallback>
    </>
  )
}

export default Languages
