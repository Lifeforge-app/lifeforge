import type { ComponentProps } from 'react'

import { Flex, Icon, Text } from '@lifeforge/ui'

import { useWalletStore } from '@/stores/useWalletStore'
import numberToCurrency from '@/utils/numberToCurrency'

function AssetAmount({
  amount,
  display
}: {
  amount: number
  display?: ComponentProps<typeof Flex>['display']
}) {
  const { isAmountHidden } = useWalletStore()

  return (
    <Flex asChild align={isAmountHidden ? 'center' : 'end'} display={display}>
      <Text size="2xl" weight="medium">
        <Text color="muted" mr="sm" size="xl">
          RM
        </Text>
        {isAmountHidden ? (
          <Flex align="center">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Icon key={i} icon="uil:asterisk" size="1em" />
              ))}
          </Flex>
        ) : (
          <Text truncate>{numberToCurrency(amount)}</Text>
        )}
      </Text>
    </Flex>
  )
}

export default AssetAmount
