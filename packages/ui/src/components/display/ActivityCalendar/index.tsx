import { cloneElement, useId } from 'react'
import {
  type Activity,
  type Labels,
  type Props,
  ActivityCalendar as ReactActivityCalendar
} from 'react-activity-calendar'

import { EmptyStateScreen, Tooltip } from '@/components/feedback'
import { Listbox, ListboxOption } from '@/components/inputs'
import { Box, type BoxProps, Flex } from '@/components/primitives'
import { usePersonalization } from '@/providers'
import anyColorToHex from '@/utils/anyColorToHex'

export type { Activity, Labels } from 'react-activity-calendar'

export interface ActivityCalendarProps extends Omit<
  Props,
  'colorScheme' | 'data' | 'labels' | 'ref' | 'renderBlock' | 'theme'
> {
  /** The list of activity entries to display. */
  data: Activity[]
  /** The colour used for the highest activity level. Defaults to the personalized theme colour. */
  accentColor?: string
  /** Localization strings forwarded to the underlying activity calendar. */
  labels?: Labels
  /** Returns the content displayed in the tooltip for a given day.
   * When omitted, no tooltip will be attached to the calendar blocks. */
  tooltipContent?: (activity: Activity) => string
  /** A unique identifier for the tooltip element. Auto-generated when omitted. */
  tooltipId?: string
  /** Whether to display the empty state screen instead of the calendar. Defaults to `data.length === 0`. */
  empty?: boolean
  /** The message displayed in the empty state screen. */
  emptyMessage?: React.ComponentProps<typeof EmptyStateScreen>['message']
  /** The icon displayed in the empty state screen. */
  emptyIcon?: string
  /** The height of the calendar container. */
  height?: BoxProps['height']
  /** The currently selected year. The year picker is only shown when this, `firstYear` and `onYearChange` are provided. */
  year?: number
  /** The earliest year available for selection. */
  firstYear?: number
  /** Called when the user selects a different year. */
  onYearChange?: (year: number) => void
}

/**
 * A reusable activity calendar that displays daily activity intensity in a
 * GitHub-style contribution graph. Handles theme colours, tooltips, an optional
 * year picker and the empty state.
 */
export function ActivityCalendar({
  data,
  accentColor,
  labels,
  tooltipContent,
  tooltipId,
  empty,
  emptyMessage = { id: 'activities' },
  emptyIcon = 'tabler:calendar-off',
  height,
  year,
  firstYear,
  onYearChange,
  showWeekdayLabels = true,
  ...rest
}: ActivityCalendarProps) {
  const { bgTempPalette, derivedTheme, derivedThemeColor } =
    usePersonalization()

  const generatedId = useId()

  const resolvedTooltipId =
    tooltipId ??
    `activity-calendar-${generatedId.replace(/[^a-zA-Z0-9-_]/g, '')}`
  const resolvedAccentColor =
    accentColor ?? anyColorToHex(derivedThemeColor) ?? '#a9d066'

  const showYearPicker =
    year !== undefined && firstYear !== undefined && onYearChange !== undefined

  if (empty ?? data.length === 0) {
    return <EmptyStateScreen icon={emptyIcon} message={emptyMessage} />
  }

  return (
    <Flex direction="column" width="100%">
      {showYearPicker && (
        <Listbox mb="lg" value={year} width="100%" onChange={onYearChange}>
          {Array.from(
            { length: new Date().getFullYear() - firstYear + 1 },
            (_, index) => (
              <ListboxOption
                key={index}
                label={`${firstYear + index}`}
                value={firstYear + index}
              />
            )
          )}
        </Listbox>
      )}
      <Box height={height} minWidth="0" overflowX="auto" width="100%">
        <ReactActivityCalendar
          colorScheme={derivedTheme}
          data={data}
          labels={labels}
          renderBlock={
            tooltipContent
              ? (block, activity) =>
                  cloneElement(block, {
                    'data-tooltip-id': resolvedTooltipId,
                    'data-tooltip-content': tooltipContent(activity)
                  })
              : undefined
          }
          showWeekdayLabels={showWeekdayLabels}
          theme={{
            dark: [bgTempPalette[800], resolvedAccentColor],
            light: [bgTempPalette[200], resolvedAccentColor]
          }}
          {...rest}
        />
      </Box>
      {tooltipContent && <Tooltip id={resolvedTooltipId} />}
    </Flex>
  )
}
