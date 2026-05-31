import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useRef } from 'react'
import tinycolor from 'tinycolor2'

import { useDivSize, usePersonalization } from '@lifeforge/shared'
import type { WidgetConfig } from '@lifeforge/shared'
import { Card, Flex, Text } from '@lifeforge/ui'

import { arabicToChinese } from '../utils/arabicToChineseNumber'

dayjs.extend(weekOfYear)

export default function DateWidget({
  dimension: { w, h }
}: {
  dimension: { w: number; h: number }
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { width } = useDivSize(containerRef)

  const { language, derivedThemeColor: themeColor } = usePersonalization()

  return (
    <Card
      ref={containerRef}
      asChild
      align={
        h === 2 ? 'start' : h === 1 ? { base: 'center', sm: 'end' } : 'start'
      }
      bg="primary"
      direction={h === 2 ? 'column' : h === 1 ? 'row' : 'column'}
      gap="md"
      height="100%"
      justify={h === 2 ? 'end' : undefined}
    >
      <Text
        as="div"
        color={tinycolor(themeColor).isLight() ? 'bg-800' : 'bg-100'}
      >
        <Text
          asChild
          color="primary"
          size={w === 2 && h === 1 ? { base: '2xl', sm: '4xl' } : '4xl'}
          weight="semibold"
        >
          <Flex
            centered
            aspectRatio={h === 1 ? '1/1' : { base: '1/1', sm: 'auto' }}
            bg={{ base: 'bg-100', dark: 'bg-900' }}
            height={
              w === 2 && h === 1
                ? { base: 'auto', sm: '100%' }
                : h === 1
                  ? '100%'
                  : { base: '100%', sm: 'auto' }
            }
            p={w === 2 && h === 1 ? { base: 'md', sm: 'md' } : 'md'}
            r="md"
          >
            {dayjs().format('DD')}
          </Flex>
        </Text>
        <Flex direction="column" gap="xs" minWidth="0" width="100%">
          <Text
            size={w === 2 && h === 1 ? { base: 'lg', sm: '2xl' } : '2xl'}
            weight="semibold"
          >
            {dayjs()
              .locale(language)
              .format(width < 150 ? 'ddd' : 'dddd')}
          </Text>
          <Text>
            {dayjs()
              .locale(language)
              .format(
                width > 180
                  ? language.startsWith('zh')
                    ? 'YYYY[年] MMMM'
                    : 'MMMM YYYY'
                  : 'MM/YYYY'
              )}
            <Text
              display={
                w === 2 && h === 1 ? { base: 'none', sm: 'inline' } : 'inline'
              }
            >
              ,{' '}
              {(() => {
                switch (language) {
                  case 'zh-CN':
                  case 'zh-TW':
                    return `第${arabicToChinese(
                      `${dayjs().week()}`,
                      language.endsWith('-CN') ? 'simplified' : 'traditional'
                    )}${language.endsWith('-CN') ? '周' : '週'}`
                  case 'ms':
                    return dayjs().week() < 4
                      ? `Minggu ${
                          ['pertama', 'kedua', 'ketiga'][dayjs().week() - 1]
                        }`
                      : `Minggu ke-${dayjs().week()}`
                  default:
                    return `Week ${dayjs().week()}`
                }
              })()}
            </Text>
          </Text>
        </Flex>
      </Text>
    </Card>
  )
}

export const config: WidgetConfig = {
  id: 'date',
  icon: 'tabler:calendar-clock',
  minW: 2,
  minH: 1,
  maxW: 4,
  maxH: 2
}
