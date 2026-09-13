import { useModuleTranslation } from '@lifeforge/localization'
import {
  Flex,
  type FlexProps,
  Listbox,
  ListboxOption,
  Text,
  surface
} from '@lifeforge/ui'

function IntervalSelector<T extends string>({
  options,
  lastFor,
  setLastFor,
  ...rest
}: {
  options: T[]
  lastFor: T
  setLastFor: (value: T) => void
} & FlexProps<'div'>) {
  const { t } = useModuleTranslation()

  return (
    <Flex align="center" flexShrink="0" gap="sm" {...rest}>
      <Text
        color="muted"
        display={{ base: 'none', md: 'block' }}
        size="sm"
        tracking="wide"
        weight="medium"
      >
        {t('labels.inThePast')}
      </Text>
      <Listbox
        bg={surface.light}
        renderContent={() => (
          <span>{`${lastFor.split(' ')[0]} ${t(`units.${lastFor.split(' ')[1].toLowerCase()}`)}`}</span>
        )}
        value={lastFor}
        width={{ base: '100%', md: '12rem' }}
        onChange={setLastFor}
      >
        {options.map((last, index) => (
          <ListboxOption
            key={index}
            icon="tabler:clock"
            label={`${last.split(' ')[0]} ${t(`units.${last.split(' ')[1].toLowerCase()}`)}`}
            value={last}
          />
        ))}
      </Listbox>
    </Flex>
  )
}

export default IntervalSelector
