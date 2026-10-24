import { Flex, Icon, Text } from '@/components/primitives'
import { usePersonalization } from '@/providers'

import * as styles from '../ChineseTraditionalColorsModal.css'

function ColorSwatch({
  name,
  value,
  selected,
  onSelect
}: {
  name: string
  value: string
  selected: boolean
  onSelect: () => void
}) {
  const { getMostReadableColor } = usePersonalization()

  const textColor = getMostReadableColor(value)

  return (
    <Flex
      shadow
      align="center"
      as="button"
      aspectRatio="0.5"
      direction="column"
      justify="between"
      overflow="hidden"
      p="md"
      position="relative"
      r="md"
      style={{ backgroundColor: value, color: textColor }}
      title={`${name} ${value}`}
      width="100%"
      onClick={onSelect}
    >
      <Text
        className={styles.verticalText}
        leading="tight"
        style={{ color: textColor }}
        tracking="wide"
        whiteSpace="nowrap"
      >
        {name}
      </Text>
      <Text size="sm" style={{ color: textColor }} whiteSpace="nowrap">
        {value}
      </Text>
      {selected && (
        <Flex centered inset="0" position="absolute">
          <Icon icon="tabler:check" size="2em" style={{ color: textColor }} />
        </Flex>
      )}
    </Flex>
  )
}

export { ColorSwatch }
