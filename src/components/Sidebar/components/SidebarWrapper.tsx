import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import useThemeColors from '@hooks/useThemeColor'

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
  const { componentBg } = useThemeColors()

  return (
    <aside
      className={`absolute ${
        isOpen ? 'left-0' : 'left-full'
      } top-0 z-[9990] size-full shrink-0 rounded-lg py-4 shadow-custom duration-300 xl:static ${componentBg} ${
        customHeight ?? 'xl:h-[calc(100%-2rem)]'
      } xl:w-1/4 xl:min-w-96`}
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
