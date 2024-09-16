import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'

function Sidebar(): React.ReactElement {
  const [isOpen, setOpen] = useState(true)

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <SidebarItem icon="tabler:list" name="All books" />
      <SidebarItem icon="tabler:star-filled" name="Starred" />
      <SidebarDivider />
      <SidebarTitle name="categories" />
      {[
        ['tabler:math-integral-x', 'Calculus'],
        ['tabler:math-pi', 'Mathematics'],
        ['tabler:atom', 'Physics'],
        ['tabler:code', 'Computer Science']
      ].map(([icon, name], index) => (
        <li
          key={index}
          className="relative flex w-full min-w-0 items-center gap-6 px-4 font-medium text-bg-500 transition-all"
        >
          <div className="flex w-full min-w-0 items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
            <Icon icon={icon} className="size-5 shrink-0 " />
            <div className="w-full min-w-0 truncate">{name}</div>
            <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
          </div>
        </li>
      ))}
      <SidebarDivider />
      <SidebarTitle name="languages" />
      {[
        ['emojione-monotone:flag-for-china', 'Chinese'],
        ['emojione-monotone:flag-for-united-kingdom', 'English']
      ].map(([icon, name], index) => (
        <li
          key={index}
          className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
        >
          <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
            <Icon icon={icon} className="size-5 shrink-0" />
            <div className="flex-between flex w-full">{name}</div>
            <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
          </div>
        </li>
      ))}
    </SidebarWrapper>
  )
}

export default Sidebar
