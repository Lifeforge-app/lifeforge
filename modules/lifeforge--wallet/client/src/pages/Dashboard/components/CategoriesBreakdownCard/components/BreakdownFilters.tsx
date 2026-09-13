import { useModuleTranslation } from '@lifeforge/localization'
import {
  Flex,
  Icon,
  Listbox,
  ListboxOption,
  Stack,
  Text,
  surface
} from '@lifeforge/ui'

function BreakdownFilters({
  selectedType,
  setSelectedType,
  year,
  month,
  setYearMonth,
  yearsOptions,
  monthsOptions
}: {
  selectedType: 'income' | 'expenses'
  setSelectedType: (type: 'income' | 'expenses') => void
  year: number | null
  month: number | null
  setYearMonth: (value: { year?: number | null; month?: number | null }) => void
  yearsOptions: number[]
  monthsOptions: number[]
}) {
  const { t } = useModuleTranslation(['common.misc'])

  return (
    <Stack>
      <Listbox
        bg={surface.light}
        renderContent={() => (
          <Flex align="center" gap="md">
            <Icon
              color={selectedType === 'income' ? 'green-500' : 'red-500'}
              icon={
                selectedType === 'income' ? 'tabler:login-2' : 'tabler:logout'
              }
              size="1.5rem"
            />
            <Text>{t(`transactionTypes.${selectedType}`)}</Text>
          </Flex>
        )}
        value={selectedType}
        onChange={(value: 'income' | 'expenses') => setSelectedType(value)}
      >
        {(['income', 'expenses'] as const).map(type => (
          <ListboxOption
            key={type}
            icon={type === 'income' ? 'tabler:login-2' : 'tabler:logout'}
            label={t(`transactionTypes.${type}`)}
            value={type}
          />
        ))}
      </Listbox>
      <Flex gap="sm" width="100%">
        <Listbox
          bg={surface.light}
          flex="1"
          renderContent={() => (
            <Flex align="center" gap="md">
              <Icon color="muted" icon="tabler:calendar" size="1.5rem" />
              <Text>{t('common.misc:dates.months.' + month)}</Text>
            </Flex>
          )}
          value={month}
          onChange={(value: number | null) => setYearMonth({ month: value })}
        >
          {monthsOptions.map(option => (
            <ListboxOption
              key={option}
              label={t('common.misc:dates.months.' + option)}
              value={option}
            />
          ))}
        </Listbox>
        <Listbox
          bg={surface.light}
          renderContent={() => (
            <Flex align="center" gap="md">
              <Text>{year}</Text>
            </Flex>
          )}
          value={year}
          width="min-content"
          onChange={(value: number | null) => setYearMonth({ year: value })}
        >
          {yearsOptions.map(option => (
            <ListboxOption
              key={option}
              label={option.toString()}
              value={option}
            />
          ))}
        </Listbox>
      </Flex>
    </Stack>
  )
}

export default BreakdownFilters
