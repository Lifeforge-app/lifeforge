import clsx from 'clsx'
import { useSidebarState } from 'shared'

import SidebarSubsectionItem from './SidebarSubsectionItem'
import SidebarSubsectionItemWithOnClick from './SidebarSubsectionItemWithOnClick'

function SidebarItemSubsection({
  subsection,
  label,
  subsectionExpanded,
  namespace
}: {
  subsection: {
    label: string
    icon: string | React.ReactElement
    callback:
      | string
      | {
          onClick: () => void
          active: boolean
        }
    amount?: number
  }[]
  namespace?: string | false
  label: string | React.ReactElement
  subsectionExpanded: boolean
}) {
  const { sidebarExpanded } = useSidebarState()

  return (
    <li
      className={clsx(
        'flex h-auto shrink-0 flex-col gap-2 overflow-hidden px-4 transition-all',
        subsectionExpanded ? 'max-h-[1000px] py-2' : 'max-h-0 py-0'
      )}
    >
      <ul
        className={clsx(
          'flex w-full flex-col items-center gap-0.5 rounded-lg',
          !sidebarExpanded &&
            typeof subsection[0].callback === 'string' &&
            'bg-bg-100 dark:bg-bg-800/30'
        )}
      >
        {subsection.map(({ label: subsectionLabel, icon, callback, amount }) =>
          typeof callback === 'string' ? (
            <SidebarSubsectionItem
              key={subsectionLabel}
              icon={icon}
              label={label}
              path={callback}
              subsectionLabel={subsectionLabel}
            />
          ) : (
            <SidebarSubsectionItemWithOnClick
              key={subsectionLabel}
              active={callback.active}
              amount={amount}
              icon={icon}
              label={label}
              namespace={namespace}
              subsectionLabel={subsectionLabel}
              onClick={callback.onClick}
            />
          )
        )}
      </ul>
    </li>
  )
}

export default SidebarItemSubsection
