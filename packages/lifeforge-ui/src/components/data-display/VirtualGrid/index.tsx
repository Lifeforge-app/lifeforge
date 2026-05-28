import { useEffect, useMemo, useRef } from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List
} from 'react-virtualized'

import { Box, Grid } from '@components/primitives'

interface VirtualGridProps<T> {
  /** The array of items to render in the grid */
  items: T[]
  /** Function to render each individual item. Receives the item and returns a React node */
  renderItem: (item: T) => React.ReactNode
  /** Function to extract a unique key from each item */
  getItemKey: (item: T) => string | number
  /** Minimum width of each item in pixels. Used to calculate items per row */
  itemMinWidth?: number
  /** Default estimated height for rows before measurement. Defaults to 320px */
  defaultRowHeight?: number
}

/**
 * A virtualized grid component that efficiently renders large lists of items
 * with dynamic row heights. Uses react-virtualized under the hood for optimal
 * performance with large datasets.
 */
export function VirtualGrid<T>({
  items,
  renderItem,
  getItemKey,
  itemMinWidth = 240,
  defaultRowHeight = 320
}: VirtualGridProps<T>) {
  const listRef = useRef<List>(null)

  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        defaultHeight: defaultRowHeight,
        fixedWidth: true
      }),
    [defaultRowHeight]
  )

  // Clear cache, recompute row positions, and scroll to top when items change
  useEffect(() => {
    cache.clearAll()
    listRef.current?.recomputeRowHeights()
    listRef.current?.scrollToRow(0)
  }, [items, cache])

  return (
    <AutoSizer>
      {({ width, height }: { width: number; height: number }) => {
        const itemsPerRow = Math.floor(width / itemMinWidth) || 1

        return (
          <List
            ref={listRef}
            className="virtual-grid"
            deferredMeasurementCache={cache}
            height={height}
            rowCount={Math.ceil(items.length / itemsPerRow)}
            rowHeight={cache.rowHeight}
            rowRenderer={({ index, key, style, parent }) => {
              const fromIndex = index * itemsPerRow

              const toIndex = fromIndex + itemsPerRow

              return (
                <CellMeasurer
                  key={key}
                  cache={cache}
                  columnIndex={0}
                  parent={parent}
                  rowIndex={index}
                >
                  <Grid
                    as="div"
                    columns={`repeat(${itemsPerRow}, 1fr)`}
                    gap="md"
                    pb="md"
                    style={style}
                    width="100%"
                  >
                    {items.slice(fromIndex, toIndex).map(item => (
                      <Box
                        key={getItemKey(item)}
                        as="div"
                        minWidth="0"
                        width="100%"
                      >
                        {renderItem(item)}
                      </Box>
                    ))}
                  </Grid>
                </CellMeasurer>
              )
            }}
            width={width}
          />
        )
      }}
    </AutoSizer>
  )
}
