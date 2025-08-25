import { GoBackButton } from '@components/buttons'
import { useModuleSidebarState } from '@components/layouts'
import { Scrollbar } from '@components/utilities'
import clsx from 'clsx'

function SidebarWrapper({
  customHeight,
  children
}: {
  customHeight?: string
  children: React.ReactNode
}) {
  const { isSidebarOpen, setIsSidebarOpen } = useModuleSidebarState()

  return (
    <aside
      className={clsx(
        'bg-bg-50 shadow-custom xl:component-bg dark:bg-bg-900 absolute top-0 size-full shrink-0 rounded-lg py-4 backdrop-blur-xs transition-all duration-300 xl:static xl:w-1/4 xl:min-w-96 xl:backdrop-blur-xs',
        isSidebarOpen ? 'left-0 z-[9990]' : 'left-full',
        customHeight ?? 'xl:h-[calc(100%-2rem)]'
      )}
    >
      <Scrollbar>
        <div className="flex-between flex px-8 py-4 xl:hidden">
          <GoBackButton
            onClick={() => {
              setIsSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex size-full min-w-0 flex-col">{children}</ul>
      </Scrollbar>
    </aside>
  )
}

export default SidebarWrapper
