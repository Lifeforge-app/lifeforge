import clsx from 'clsx'

import { Flex, Text, Transition } from '@/components/primitives'
import { colorWithOpacity } from '@/system/colors/color-with-opacity'

import * as styles from './SidebarItemWrapper.css'

export function SidebarItemWrapper({
  active,
  children,
  className,
  onClick
}: {
  active: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <Transition>
      <Text
        asChild
        color={active ? { base: 'bg-800', dark: 'bg-50' } : 'bg-500'}
        weight={active ? 'semibold' : undefined}
      >
        <Flex
          align="center"
          as="li"
          className={clsx(
            'sidebar-item',
            active && styles.listItemActiveIndicator,
            className
          )}
          justify="center"
          position="relative"
          px="md"
        >
          <Transition duration="0.1s">
            <Flex
              asChild
              align="center"
              as="button"
              bg={
                active
                  ? {
                      base: colorWithOpacity('bg-200', '50%'),
                      dark: 'bg-800'
                    }
                  : {
                      hover: colorWithOpacity('bg-200', '30%'),
                      darkHover: colorWithOpacity('bg-800', '30%')
                    }
              }
              className="group"
              gap="md"
              height="3.5em"
              justify="between"
              pl="md"
              position="relative"
              pr="md"
              r="lg"
              role="button"
              style={{
                cursor: 'pointer'
              }}
              tabIndex={0}
              width="100%"
              onClick={onClick}
            >
              <Text align="left">{children}</Text>
            </Flex>
          </Transition>
        </Flex>
      </Text>
    </Transition>
  )
}
