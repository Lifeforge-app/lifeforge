import { createPortal } from 'react-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import { Box, Text } from '@/components/primitives'
import { useMainSidebarState } from '@/providers'

import { tooltip } from './Tooltip.css'

/**
 * A general-purpose tooltip rendered into a portal. Attach it to any trigger
 * element by giving the trigger a matching `data-tooltip-id`.
 * For all available props, refer to the ReactTooltip documentation: https://react-tooltip.com/docs/getting-started
 */
export function Tooltip({
  id,
  children,
  contentProps,
  render,
  ...tooltipProps
}: {
  /** The unique identifier for the tooltip element. Must match the `data-tooltip-id` of its trigger. */
  id: string
  /** The content to display inside the tooltip when triggered. Falls back to the trigger's `data-tooltip-content`. */
  children?: React.ReactNode
  /** Optional additional props to apply to the tooltip's content container. */
  contentProps?: React.ComponentProps<typeof Box>
  /** Additional properties to pass to the underlying ReactTooltip component. */
} & React.ComponentProps<typeof ReactTooltip>) {
  const { sidebarExpanded } = useMainSidebarState()

  return createPortal(
    <Box zIndex={{ base: sidebarExpanded ? '-1' : '9999', lg: '9999' }}>
      <ReactTooltip
        noArrow
        className={tooltip}
        id={id}
        opacity={1}
        positionStrategy="fixed"
        render={
          render ??
          (({ content }) => {
            const node = children ?? content

            return node ? (
              <Box
                shadow
                bg={{ base: 'bg-50', dark: 'bg-800' }}
                maxHeight="24rem"
                maxWidth="24rem"
                minWidth="16rem"
                overflowY="auto"
                p="md"
                position="relative"
                r="md"
                style={{ whiteSpace: 'normal' }}
                {...contentProps}
              >
                <Text as="div" color="muted">
                  {node}
                </Text>
              </Box>
            ) : null
          })
        }
        style={{
          background: 'transparent'
        }}
        {...tooltipProps}
      />
    </Box>,
    document.getElementById('app') ?? document.body
  ) as React.ReactPortal
}
