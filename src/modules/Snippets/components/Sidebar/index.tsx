/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import SidebarDivider from '../../../../components/Sidebar/components/SidebarDivider'
import SidebarItem from '../../../../components/Sidebar/components/SidebarItem'
import Labels, { type ICodeSnippetsLabel } from './components/Labels'
import Languages, { type ICodeSnippetsLanguage } from './components/Languages'

function Sidebar({
  labels,
  languages,
  updateLabelList,
  updateLanguageList
}: {
  labels: ICodeSnippetsLabel[] | 'error' | 'loading'
  languages: ICodeSnippetsLanguage[] | 'error' | 'loading'
  updateLabelList: () => void
  updateLanguageList: () => void
}): React.ReactElement {
  return (
    <aside className="h-full w-1/4 overflow-y-scroll rounded-lg bg-neutral-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
      <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
        <SidebarItem icon="tabler:list" name="All Snippets" active />
        <SidebarItem icon="tabler:star-filled" name="Starred" />
        <SidebarDivider />
        <Labels labels={labels} updateLabelList={updateLabelList} />
        <SidebarDivider />
        <Languages
          languages={languages}
          updateLanguageList={updateLanguageList}
        />
      </ul>
    </aside>
  )
}

export default Sidebar
