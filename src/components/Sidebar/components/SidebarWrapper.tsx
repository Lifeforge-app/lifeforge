import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import Scrollbar from '@components/Scrollbar'

function SidebarWrapper({
  isOpen,
  setOpen,
  customHeight,
  children
}: {
  isOpen: boolean
  setOpen: (value: boolean) => void
  customHeight?: string
  children: React.ReactNode
}): React.ReactElement {
  return (
    <aside
      className={`absolute ${
        isOpen ? 'left-0' : 'left-full'
      } top-0 z-[9990] size-full shrink-0 rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 xl:static ${
        customHeight ?? 'xl:h-[calc(100%-2rem)]'
      } xl:w-1/4`}
    >
      <Scrollbar>
        <div className="flex-between flex px-8 py-4 xl:hidden">
          <GoBackButton
            onClick={() => {
              setOpen(false)
            }}
          />
        </div>
        <ul className="flex w-full min-w-0 flex-col">{children}</ul>
      </Scrollbar>
    </aside>
  )
}

export default SidebarWrapper
