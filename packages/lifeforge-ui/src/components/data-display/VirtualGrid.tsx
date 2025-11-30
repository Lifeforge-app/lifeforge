import { useEffect, useMemo, useRef } from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List
} from 'react-virtualized'

export interface VirtualGridProps<T> {
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
  /** Gap between items in pixels. Defaults to 12px (equivalent to gap-3 in Tailwind) */
  gap?: number
  /** Additional CSS class names to apply to each row container */
  rowClassName?: string
}

/**
 * A virtualized grid component that efficiently renders large lists of items
 * with dynamic row heights. Uses react-virtualized under the hood for optimal
 * performance with large datasets.
 */
function VirtualGrid<T>({
  items,
  renderItem,
  getItemKey,
  itemMinWidth = 240,
  defaultRowHeight = 320,
  gap = 12,
  rowClassName = ''
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
                  <div
                    className={rowClassName}
                    style={{
                      ...style,
                      display: 'grid',
                      gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
                      width: '100%',
                      gap: `${gap}px`,
                      paddingBottom: `${gap}px`
                    }}
                  >
                    {items.slice(fromIndex, toIndex).map(item => (
                      <div
                        key={getItemKey(item)}
                        className="w-full min-w-0"
                        style={{ flex: 1 }}
                      >
                        {renderItem(item)}
                      </div>
                    ))}
                  </div>
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

export default VirtualGrid
