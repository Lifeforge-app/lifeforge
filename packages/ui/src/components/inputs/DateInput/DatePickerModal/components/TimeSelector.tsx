import dayjs from 'dayjs'
import { range } from 'lodash'

import { Button, Listbox } from '@/components/inputs'
import { ListboxOption } from '@/components/inputs/ListboxInput/components/ListboxOption'
import { Flex, Text } from '@/components/primitives'
import { surface } from '@/system'

import { useDatePicker } from '../contexts/DatePickerContext'

export function TimeSelector() {
  const { selectedDate, setSelectedDate } = useDatePicker()

  const activeDate = selectedDate ?? dayjs()

  const currentHour24 = activeDate.hour()
  const isPM = currentHour24 >= 12

  function handleAMPMChange(period: 'AM' | 'PM') {
    if (period === 'AM' && isPM) {
      setSelectedDate(activeDate.set('hour', currentHour24 - 12))
    } else if (period === 'PM' && !isPM) {
      setSelectedDate(activeDate.set('hour', currentHour24 + 12))
    }
  }

  return (
    <Flex align="center" direction={{ base: 'column', sm: 'row' }} gap="sm">
      <Flex align="center" gap="sm" width="100%">
        <Listbox
          bg={surface.lightInteractive}
          flex="1"
          gap="sm"
          height="auto"
          py="sm"
          renderContent={value => (
            <Text size="base" weight="medium">
              {value.toString().padStart(2, '0')}
            </Text>
          )}
          value={currentHour24 % 12 === 0 ? 12 : currentHour24 % 12}
          onChange={h12 => {
            const h24 = isPM
              ? h12 === 12
                ? 12
                : h12 + 12
              : h12 === 12
                ? 0
                : h12
            setSelectedDate(activeDate.set('hour', h24))
          }}
        >
          {range(1, 13).map(hour => (
            <ListboxOption
              key={hour}
              label={hour.toString().padStart(2, '0')}
              value={hour}
            />
          ))}
        </Listbox>
        <Text size="base" weight="bold">
          :
        </Text>
        <Listbox
          bg={surface.lightInteractive}
          flex="1"
          gap="sm"
          height="auto"
          py="sm"
          renderContent={value => (
            <Text size="base" weight="medium">
              {value.toString().padStart(2, '0')}
            </Text>
          )}
          value={activeDate.minute()}
          onChange={m => setSelectedDate(activeDate.set('minute', m))}
        >
          {range(0, 60).map(minute => (
            <ListboxOption
              key={minute}
              label={minute.toString().padStart(2, '0')}
              value={minute}
            />
          ))}
        </Listbox>
      </Flex>
      <Flex
        bg={surface.light}
        gap="xs"
        p="xs"
        r="md"
        width={{ base: '100%', sm: 'auto' }}
      >
        {(['AM', 'PM'] as const).map(label => (
          <Button
            key={label}
            flex={{ base: '1', sm: 'none' }}
            namespace={false}
            p="xs"
            r="md"
            variant={(label === 'AM' ? !isPM : isPM) ? 'primary' : 'plain'}
            onClick={() => handleAMPMChange(label)}
          >
            {label}
          </Button>
        ))}
      </Flex>
    </Flex>
  )
}
