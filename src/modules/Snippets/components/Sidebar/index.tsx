/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import SidebarDivider from '../../../../components/Sidebar/components/SidebarDivider'
import SidebarItem from '../../../../components/Sidebar/components/SidebarItem'
import SidebarTitle from '../../../../components/Sidebar/components/SidebarTitle'
import { toast } from 'react-toastify'

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

function Sidebar(): React.ReactElement {
  const [labels, setLabels] = useState<
    ICodeSnippetsLabel[] | 'error' | 'loading'
  >('loading')
  const [languages, setLanguages] = useState<
    ICodeSnippetsLanguage[] | 'error' | 'loading'
  >('loading')

  function updateLabelList(): void {
    fetch(`${import.meta.env.VITE_API_HOST}/code-snippets/label/list`)
      .then(async response => {
        const data = await response.json()

        if (response.status !== 200) {
          throw data.message
        }

        setLabels(data.data)
      })
      .catch(() => {
        toast.error('Failed to fetch data from server.')
      })
  }

  function updateLanguageList(): void {
    fetch(`${import.meta.env.VITE_API_HOST}/code-snippets/language/list`)
      .then(async response => {
        const data = await response.json()
        if (response.status !== 200) {
          throw data.message
        }

        setLanguages(data.data)
      })
      .catch(() => {
        toast.error('Failed to fetch data from server.')
      })
  }

  useEffect(() => {
    updateLabelList()
    updateLanguageList()
  }, [])
  return (
    <aside className="h-full w-1/4 overflow-y-scroll rounded-lg bg-neutral-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
      <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
        <SidebarItem icon="tabler:list" name="All Snippets" />
        <SidebarItem icon="tabler:star-filled" name="Starred" />
        <SidebarDivider />
        <SidebarTitle name="labels" actionButtonIcon="tabler:plus" />
        {(() => {
          switch (labels) {
            case 'loading':
              return (
                <div className="flex items-center justify-center gap-2 px-8 py-2">
                  <span className="small-loader-light" />
                </div>
              )
            case 'error':
              return (
                <div className="flex items-center justify-center gap-2 px-8 py-2 text-red-500">
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
        <SidebarDivider />
        <SidebarTitle name="languages" actionButtonIcon="tabler:plus" />
        {(() => {
          switch (languages) {
            case 'loading':
              return (
                <div className="flex items-center justify-center gap-2 px-8 py-2">
                  <span className="small-loader-light" />
                </div>
              )
            case 'error':
              return (
                <div className="flex items-center justify-center gap-2 px-8 py-2 text-red-500">
                  <Icon icon="tabler:alert-triangle" className="h-5 w-5" />
                  <span>Failed to fetch data.</span>
                </div>
              )
            default:
              return languages.map(item => (
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
              ))
          }
        })()}
      </ul>
    </aside>
  )
}

export default Sidebar
