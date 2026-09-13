import dayjs from 'dayjs'

import { Flex, Icon, Text } from '@lifeforge/ui'

function StatementHeader({ month, year }: { month: number; year: number }) {
  return (
    <>
      <Flex
        align="center"
        as="h1"
        display={{ base: 'none', print: 'flex' }}
        gap="sm"
        mb="xl"
      >
        <Icon
          color={{ base: 'custom-500', print: 'custom-600' }}
          icon="tabler:hammer"
          size="3rem"
        />
        <Text size="4xl" weight="medium" whiteSpace="nowrap">
          Lifeforge
          <Text color={{ base: 'custom-500', print: 'custom-600' }}>.</Text>
        </Text>
      </Flex>
      <Text
        as="h1"
        display={{ base: 'none', print: 'block' }}
        leading="snug"
        size="6xl"
        tracking="widest"
        transform="uppercase"
        weight="bold"
      >
        Personal
        <br />
        Financial Statements
      </Text>
      <Text
        color="muted"
        display={{ base: 'none', print: 'block' }}
        mt="md"
        size="3xl"
      >
        For the month ended{' '}
        <Text color={{ base: 'bg-100', print: 'bg-950' }} weight="bold">
          {dayjs()
            .year(year)
            .month(month + 1)
            .date(0)
            .format('DD MMMM YYYY')}
        </Text>
      </Text>
    </>
  )
}

export default StatementHeader
