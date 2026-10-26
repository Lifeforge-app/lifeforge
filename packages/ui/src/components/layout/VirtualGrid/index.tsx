import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useEffect, useRef, useState } from 'react'

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
  /**
   * Fixed row height in pixels. Use for uniform grids such as icon pickers;
   * rows are not measured and only visible rows are rendered.
   */
  fixedRowHeight?: number
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
 * A virtualized grid component that renders large lists of items. Rows are
 * measured as they enter the viewport; pass `fixedRowHeight` for uniform grids
 * to skip measurement entirely.
 */
export function VirtualGrid<T>({
  items,
  renderItem,
  getItemKey,
  itemMinWidth = 240,
  defaultRowHeight = 320,
  fixedRowHeight
}: VirtualGridProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  const isFixedHeight = fixedRowHeight !== undefined

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
    estimateSize: () => fixedRowHeight ?? defaultRowHeight,
    getScrollElement: () => scrollRef.current,
    overscan: 3
  })

  useEffect(() => {
    if (isFixedHeight) {
      virtualizer.scrollToOffset(0)
    }
  }, [items, isFixedHeight, virtualizer])

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
      {width > 0 && (
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
              {...(isFixedHeight
                ? {}
                : {
                    ref: virtualizer.measureElement,
                    'data-index': row.index
                  })}
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
      )}
    </div>
  )
}
