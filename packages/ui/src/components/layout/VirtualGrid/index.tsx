import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Flex, Grid } from '@/components/primitives'

interface VirtualGridProps<T> {
  /** The array of items to render in the grid */
  items: T[]
  /** Function to render each individual item. Receives the item and returns a React node */
  renderItem: (item: T) => React.ReactNode
  /** Function to extract a unique key from each item */
  getItemKey: (item: T) => string | number
  /** Minimum width of each item in pixels. Used to calculate items per row */
  itemMinWidth?: number
  /** Estimated height for rows before they are measured. Defaults to 320px */
  defaultRowHeight?: number
  /** Value that triggers a full re-measurement when it changes (e.g. async content) */
  remeasureKey?: unknown
}

interface VirtualGridRowProps<T> {
  items: T[]
  fromIndex: number
  toIndex: number
  itemsPerRow: number
  renderItem: (item: T) => React.ReactNode
  getItemKey: (item: T) => string | number
}

function VirtualGridRowContent<T>({
  items,
  fromIndex,
  toIndex,
  itemsPerRow,
  renderItem,
  getItemKey
}: VirtualGridRowProps<T>) {
  return (
    <Grid
      as="div"
      gap="md"
      pb="md"
      templateCols={`repeat(${itemsPerRow}, 1fr)`}
      width="100%"
    >
      {items.slice(fromIndex, toIndex).map(item => (
        <Flex
          key={getItemKey(item)}
          direction="column"
          minWidth="0"
          width="100%"
        >
          {renderItem(item)}
        </Flex>
      ))}
    </Grid>
  )
}

const VirtualGridRowContentMemo = memo(
  VirtualGridRowContent
) as typeof VirtualGridRowContent

/**
 * A virtualized grid component that renders large lists of items with dynamic
 * row heights. Rows are measured offscreen before rendering so the scroll
 * range is final from the start, and live `ResizeObserver` measurements keep
 * rows adapting when their content changes afterwards.
 */
export function VirtualGrid<T>({
  items,
  renderItem,
  getItemKey,
  itemMinWidth = 240,
  defaultRowHeight = 320,
  remeasureKey
}: VirtualGridProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  // The width, items and remeasure key the current measurements were taken for
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null)
  const [measuredItems, setMeasuredItems] = useState<T[] | null>(null)

  const [measuredRemeasureKey, setMeasuredRemeasureKey] =
    useState<unknown>(null)

  useEffect(() => {
    const element = scrollRef.current

    if (!element) return

    setWidth(element.clientWidth)

    let timeout: ReturnType<typeof setTimeout> | undefined

    const observer = new ResizeObserver(entries => {
      const entry = entries[0]

      if (!entry) return

      clearTimeout(timeout)

      timeout = setTimeout(() => {
        setWidth(entry.contentRect.width)
      }, 100)
    })

    observer.observe(element)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [])

  const itemsPerRow = Math.max(1, Math.floor(width / itemMinWidth))
  const rowCount = Math.ceil(items.length / itemsPerRow)

  const virtualizer = useVirtualizer({
    count: rowCount,
    estimateSize: () => defaultRowHeight,
    getScrollElement: () => scrollRef.current,
    overscan: 3
  })

  const needsMeasurement =
    width > 0 &&
    (measuredWidth !== width ||
      measuredItems !== items ||
      measuredRemeasureKey !== remeasureKey)

  // Measure every row offscreen and seed the virtualizer so the scroll range
  // does not change while scrolling. Live measurements still kick in afterwards
  // if a row's content changes height.
  useLayoutEffect(() => {
    if (!needsMeasurement) return

    // Ensure the measurement cache exists before writing to it; resizeItem is
    // a no-op when measurements haven't been computed yet.
    virtualizer.getTotalSize()

    const nodes =
      measureRef.current?.querySelectorAll<HTMLElement>('[data-measure-row]')

    nodes?.forEach(node => {
      const index = Number(node.dataset.measureRow)

      if (!Number.isNaN(index)) {
        virtualizer.resizeItem(index, node.getBoundingClientRect().height)
      }
    })

    if (measuredItems !== items) {
      virtualizer.scrollToOffset(0)
    }

    setMeasuredWidth(width)
    setMeasuredItems(items)
    setMeasuredRemeasureKey(remeasureKey)
  }, [needsMeasurement, width, items, remeasureKey, virtualizer])

  return (
    <div
      ref={scrollRef}
      style={{
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative',
        width: '100%'
      }}
    >
      {needsMeasurement ? (
        <div
          ref={measureRef}
          style={{
            left: 0,
            pointerEvents: 'none',
            position: 'absolute',
            top: '-100000px',
            visibility: 'hidden',
            width: '100%'
          }}
        >
          {Array.from({ length: rowCount }, (_, index) => (
            <div key={index} data-measure-row={index}>
              <VirtualGridRowContentMemo
                fromIndex={index * itemsPerRow}
                getItemKey={getItemKey}
                items={items}
                itemsPerRow={itemsPerRow}
                renderItem={renderItem}
                toIndex={(index + 1) * itemsPerRow}
              />
            </div>
          ))}
        </div>
      ) : (
        width > 0 && (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              position: 'relative',
              width: '100%'
            }}
          >
            {virtualizer.getVirtualItems().map(row => (
              <div
                key={row.key}
                ref={virtualizer.measureElement}
                data-index={row.index}
                style={{
                  left: 0,
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${row.start}px)`,
                  width: '100%'
                }}
              >
                <VirtualGridRowContentMemo
                  fromIndex={row.index * itemsPerRow}
                  getItemKey={getItemKey}
                  items={items}
                  itemsPerRow={itemsPerRow}
                  renderItem={renderItem}
                  toIndex={(row.index + 1) * itemsPerRow}
                />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
