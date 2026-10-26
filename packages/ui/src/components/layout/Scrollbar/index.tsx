import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef
} from 'overlayscrollbars-react'
import {
  type CSSProperties,
  type UIEvent,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react'

import { Box, Flex } from '@/components/primitives'
import { type ResponsiveProp, type SpaceToken } from '@/system'

const SCROLLBAR_LANE = 12

export interface ScrollbarHandle {
  scrollToTop: () => void
  scrollToBottom: () => void
  scrollTo: (options: ScrollToOptions) => void
}

export interface ScrollbarProps {
  children: React.ReactNode
  className?: string
  style?: CSSProperties
  /**
   * @deprecated No-op. Kept so existing module call sites keep typechecking.
   */
  usePaddingRight?: boolean
  /** Prevents horizontal scrolling without hiding overflowing content vertically. */
  hideHorizontal?: boolean
  /** Lets the container shrink to its content, up to `autoHeightMax`. */
  autoHeight?: boolean
  autoHeightMax?: number | string
  /**
   * Responsive bottom padding rendered as a trailing spacer inside the scroll
   * content, so the clearance is part of the scrollable area. Defaults to `xs`,
   * which is just enough to keep the last item's box-shadow from being clipped.
   */
  pb?: ResponsiveProp<SpaceToken>
  onScroll?: (event: UIEvent<HTMLElement>) => void
}

/**
 * Custom scroll container built on OverlayScrollbars.
 *
 * Keeps the prop surface of the previous (vendored `react-custom-scrollbars`)
 * implementation so existing consumers and modules don't need to change.
 */
export const Scrollbar = forwardRef<ScrollbarHandle, ScrollbarProps>(
  function Scrollbar(
    {
      children,
      className,
      style,
      usePaddingRight: _usePaddingRight,
      hideHorizontal = false,
      autoHeight = false,
      autoHeightMax,
      pb,
      onScroll
    },
    ref
  ) {
    const scrollbarRef = useRef<OverlayScrollbarsComponentRef>(null)

    useImperativeHandle(ref, () => {
      const getViewport = (): HTMLElement | null =>
        scrollbarRef.current?.osInstance()?.elements().viewport ?? null

      return {
        scrollToTop: () => {
          getViewport()?.scrollTo({ top: 0 })
        },
        scrollToBottom: () => {
          const viewport = getViewport()

          viewport?.scrollTo({ top: viewport.scrollHeight })
        },
        scrollTo: (options: ScrollToOptions) => {
          getViewport()?.scrollTo(options)
        }
      }
    }, [])

    const hostStyle: CSSProperties = autoHeight
      ? {
          ...style,
          width: '100%',
          height: 'auto',
          maxHeight: autoHeightMax ?? '100%',
          minHeight: 0,
          paddingRight: SCROLLBAR_LANE
        }
      : {
          width: '100%',
          height: '100%',
          minHeight: 0,
          paddingRight: SCROLLBAR_LANE,
          ...style
        }

    return (
      <OverlayScrollbarsComponent
        ref={scrollbarRef}
        className={className}
        defer={false}
        events={{
          scroll: (_instance, event) => {
            onScroll?.(event as unknown as UIEvent<HTMLElement>)
          }
        }}
        options={{
          paddingAbsolute: true,
          overflow: {
            x: hideHorizontal ? 'hidden' : 'scroll',
            y: 'scroll'
          },
          scrollbars: {
            theme: 'os-theme-lifeforge',
            autoHide: 'never'
          }
        }}
        style={hostStyle}
      >
        <Flex
          direction="column"
          height={autoHeight ? undefined : '100%'}
          minHeight="0"
          minWidth="0"
          pt="xs"
          px="sm"
        >
          {children}
          <Box aria-hidden flexShrink="0" pb={pb ?? 'xs'} width="100%" />
        </Flex>
      </OverlayScrollbarsComponent>
    )
  }
)
