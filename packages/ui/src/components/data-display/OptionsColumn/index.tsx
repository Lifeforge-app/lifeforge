import { Card } from '@/components/layout'
import { Flex, Icon, Text } from '@/components/primitives'
import { Tooltip } from '@/components/utilities'
import type { ResponsiveProp, SpaceToken } from '@/system'

type DirectionValue = 'row' | 'column' | 'row-reverse' | 'column-reverse'

interface OptionsColumnProps {
  /** The title of the configuration column */
  title: string | React.ReactNode
  /** A brief description of the configuration column */
  description: React.ReactNode | string
  /** The icon to display alongside the title */
  icon: string
  /** The orientation of the configuration column */
  orientation?: 'vertical' | 'horizontal'
  /** Optional tooltip content to display alongside the title */
  tooltip?: React.ReactNode
  /** The child elements to render within the configuration column */
  children: React.ReactNode
  /** The breakpoint at which the layout should wrap. Only applies when orientation is 'horizontal' */
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | false
}

/**
 * A reusable options column component for displaying settings options.
 */
export function OptionsColumn({
  title,
  description,
  icon,
  orientation = 'horizontal',
  tooltip,
  children,
  breakpoint = 'md'
}: OptionsColumnProps) {
  const getDirection = (): ResponsiveProp<DirectionValue> => {
    if (orientation === 'vertical') return 'column'
    if (!breakpoint) return 'row'

    return { base: 'column', [breakpoint]: 'row' }
  }

  const getChildrenWidth = (): ResponsiveProp<string> | undefined => {
    if (orientation !== 'horizontal') return undefined
    if (!breakpoint) return undefined

    return { base: 'full', [breakpoint]: 'auto' }
  }

  const getChildrenMarginRight = (): ResponsiveProp<SpaceToken> | undefined => {
    if (orientation !== 'horizontal') return undefined
    if (!breakpoint) return 'sm'

    return { [breakpoint]: 'sm' }
  }

  return (
    <Card direction={getDirection()} gapX="xl" gapY="md" justify="between">
      <Flex align="center" flexShrink="1" gap="md">
        <Icon color="muted" icon={icon} mx="sm" size="1.8em" />
        <Flex direction="column">
          <Flex
            align="center"
            as="h3"
            gap="sm"
            width={{ base: 'full', md: 'auto' }}
          >
            <Text size="xl" weight="medium">
              {title}
            </Text>
            {tooltip !== undefined && (
              <Tooltip icon="tabler:info-circle" id={title?.toString() || ''}>
                {tooltip}
              </Tooltip>
            )}
          </Flex>
          {typeof description === 'string' ? (
            <Text as="p" color="muted">
              {description}
            </Text>
          ) : (
            description
          )}
        </Flex>
      </Flex>
      <Flex
        align="center"
        flexShrink="0"
        gap="sm"
        minWidth="0"
        mr={getChildrenMarginRight()}
        width={getChildrenWidth()}
      >
        {children}
      </Flex>
    </Card>
  )
}
