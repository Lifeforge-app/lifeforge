import clsx from 'clsx'
import { useMainSidebarState } from 'shared'

import { Flex, Transition } from '@components/primitives'

import * as styles from './SidebarItemSubsection.css'
import { SidebarSubsectionItemLink } from './SidebarSubsectionItemLink'
import { SidebarSubsectionItemWithOnClick } from './SidebarSubsectionItemWithOnClick'

export function SidebarItemSubsection({
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
  const { sidebarExpanded } = useMainSidebarState()

  return (
    <Transition>
      <Flex
        as="li"
        className={clsx(
          subsectionExpanded
            ? styles.subsectionExpanded
            : styles.subsectionCollapsed
        )}
        direction="column"
        flexShrink="0"
        gap="sm"
        overflow="hidden"
        px="md"
      >
        <Flex
          align="center"
          as="ul"
          className={clsx(
            !sidebarExpanded &&
              typeof subsection[0].callback === 'string' &&
              styles.subsectionListBg
          )}
          direction="column"
          rounded="lg"
          style={{ gap: '0.125rem' }}
          width="100%"
        >
          {subsection.map(
            ({ label: subsectionLabel, icon, callback, amount }) =>
              typeof callback === 'string' ? (
                <SidebarSubsectionItemLink
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
        </Flex>
      </Flex>
    </Transition>
  )
}

