import { Link, useNavigate } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Card,
  EmptyStateScreen,
  Flex,
  Icon,
  Scrollbar,
  Stack,
  Text,
  Widget,
  WithQuery,
  surface
} from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'
import { useWalletStore } from '@/stores/useWalletStore'

import numberToCurrency from '../../../utils/numberToCurrency'

function AssetsBalanceCard() {
  const navigate = useNavigate()
  const { assetsQuery } = useWalletData()
  const { isAmountHidden } = useWalletStore()
  const { t } = useModuleTranslation()

  return (
    <Widget
      actionComponent={
        <Button as={Link} p="xs" to="./assets" variant="plain">
          <Icon icon="tabler:chevron-right" />
        </Button>
      }
      gridColumnSpan={1}
      gridRowSpan={2}
      icon="tabler:wallet"
      minHeight={{ base: '24rem', xl: '0' }}
      title="Assets Balance"
    >
      <WithQuery query={assetsQuery}>
        {assets =>
          assets.length > 0 ? (
            <Scrollbar>
              <Stack as="ul" gap="sm" pb="sm">
                {assets.map(asset => (
                  <Card
                    key={asset.id}
                    as={Link}
                    bg={surface.lightInteractive}
                    direction={{ base: 'column', sm: 'row' }}
                    gap="md"
                    to={`/wallet/transactions?asset=${asset.id}`}
                  >
                    <Flex align="center" gap="md" minWidth="0" width="100%">
                      <Icon icon={asset.icon} size="1.5rem" />
                      <Text truncate weight="semibold">
                        {asset.name}
                      </Text>
                    </Flex>
                    <Flex
                      align={isAmountHidden ? 'center' : 'end'}
                      gap="sm"
                      mt={{ base: 'md', sm: 'none' }}
                    >
                      <Text color="muted" size="xl">
                        RM
                      </Text>
                      {isAmountHidden ? (
                        <Flex align="center">
                          {Array(4)
                            .fill(0)
                            .map((_, i) => (
                              <Icon key={i} icon="uil:asterisk" size="1rem" />
                            ))}
                        </Flex>
                      ) : (
                        <Text size="3xl" weight="medium">
                          {numberToCurrency(asset.current_balance)}
                        </Text>
                      )}
                    </Flex>
                  </Card>
                ))}
              </Stack>
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              smaller
              CTAButtonProps={{
                children: 'new',
                icon: 'tabler:plus',
                onClick: () => {
                  navigate('/wallet/assets#new')
                },
                tProps: { item: t('items.asset') }
              }}
              icon="tabler:wallet-off"
              message={{
                id: 'assets'
              }}
            />
          )
        }
      </WithQuery>
    </Widget>
  )
}

export default AssetsBalanceCard
