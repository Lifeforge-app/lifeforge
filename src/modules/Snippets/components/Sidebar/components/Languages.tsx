/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import SidebarTitle from '../../../../../components/Sidebar/components/SidebarTitle'

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
      {(() => {
        switch (languages) {
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
            return (
              <>
                {languages.map(item => (
                  <li
                    key={item.id}
                    className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
                  >
                    <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <Icon icon={item.icon} className="h-5 w-5 shrink-0" />
                      <div className="flex w-full items-center justify-between">
                        {item.name}
                      </div>
                      <span className="text-sm">{item.item_count}</span>
                    </div>
                  </li>
                ))}
              </>
            )
        }
      })()}
    </>
  )
}

export default Languages
