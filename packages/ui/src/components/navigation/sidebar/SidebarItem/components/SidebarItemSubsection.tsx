import { Flex, Transition } from '@/components/primitives'
import { useMainSidebarState } from '@/providers'

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
        direction="column"
        flexShrink="0"
        gap="sm"
        maxHeight={subsectionExpanded ? '1000px' : '0'}
        overflow="hidden"
        pb={subsectionExpanded ? 'sm' : 'none'}
        pt={subsectionExpanded ? 'sm' : 'none'}
        px="md"
      >
        <Flex
          align="center"
          as="ul"
          bg={
            !sidebarExpanded && typeof subsection[0].callback === 'string'
              ? { base: 'bg-100', dark: 'bg-800' }
              : undefined
          }
          direction="column"
          r="lg"
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
