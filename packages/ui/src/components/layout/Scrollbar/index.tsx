import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef
} from 'overlayscrollbars-react'
import {
  type CSSProperties,
  type UIEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
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
    const [hasVerticalOverflow, setHasVerticalOverflow] = useState(false)

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

    // The lane is only worth reserving when the scrollbar is actually shown,
    // otherwise it leaves a visible gap on the right of short content.
    const lane = hasVerticalOverflow ? SCROLLBAR_LANE : 0

    // Reserving or dropping the lane changes the viewport width without
    // changing the host's outer size, so the overflow state and handle sizes
    // have to be measured again explicitly.
    useEffect(() => {
      scrollbarRef.current?.osInstance()?.update(true)
    }, [lane])

    const hostStyle: CSSProperties = autoHeight
      ? {
          ...style,
          width: '100%',
          height: 'auto',
          maxHeight: autoHeightMax ?? '100%',
          minHeight: 0,
          paddingRight: lane
        }
      : {
          width: '100%',
          height: '100%',
          minHeight: 0,
          paddingRight: lane,
          ...style
        }

    return (
      <OverlayScrollbarsComponent
        ref={scrollbarRef}
        className={className}
        defer={false}
        events={{
          updated: instance => {
            setHasVerticalOverflow(instance.state().hasOverflow.y)
          },
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
