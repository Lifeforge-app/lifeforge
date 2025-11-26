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
        'bg-bg-50 shadow-custom xl:component-bg dark:bg-bg-900 absolute top-0 size-full shrink-0 rounded-lg py-4 backdrop-blur-xs xl:static xl:w-1/4 xl:min-w-96 xl:backdrop-blur-xs',
        isSidebarOpen
          ? 'sidebar-opening left-0 z-[9990]'
          : 'sidebar-closing left-full z-0',
        customHeight ?? 'xl:h-[calc(100%-2rem)]'
      )}
    >
      <Scrollbar usePaddingRight={false}>
        <div className="flex-between flex px-8 py-4 xl:hidden">
          <GoBackButton
            onClick={() => {
              setIsSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex size-full min-w-0 flex-col gap-1">{children}</ul>
      </Scrollbar>
    </aside>
  )
}

export default SidebarWrapper
