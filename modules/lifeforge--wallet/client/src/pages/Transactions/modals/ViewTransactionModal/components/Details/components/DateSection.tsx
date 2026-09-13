import dayjs from 'dayjs'

import { Text } from '@lifeforge/ui'

import { useTransactionDetails } from '../TransactionDetailsContext'
import DetailItem from './DetailItem'

function DateSection() {
  const transaction = useTransactionDetails()

  return (
    <DetailItem icon="tabler:calendar" label="date">
      <Text align={{ sm: 'right' }}>
        {dayjs(transaction.date).format('ddd, D MMM YYYY')}
      </Text>
    </DetailItem>
  )
}

export default DateSection
