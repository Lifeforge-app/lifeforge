import { useQueryClient } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  FAB,
  Flex,
  Listbox,
  ListboxOption,
  ModuleHeader,
  SearchInput,
  Stack,
  Text,
  Widget,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'
import { useWalletStore } from '@/stores/useWalletStore'

import TotalBalance from './components/AssetAmount'
import AssetItem from './components/AssetItem'
import ModifyAssetModal from './modals/ModifyAssetModal'

const RANGE_OPTIONS = ['week', 'month', 'quarter', 'year', 'all'] as const

type RangeMode = (typeof RANGE_OPTIONS)[number]

function Assets() {
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { assetsQuery } = useWalletData()
  const { isAmountHidden, toggleAmountVisibility } = useWalletStore()
  const { hash } = useLocation()

  const totalBalance = useMemo(() => {
    return (assetsQuery.data ?? []).reduce(
      (sum, asset) => sum + asset.current_balance,
      0
    )
  }, [assetsQuery.data])

  const [searchQuery, setSearchQuery] = useQueryState('q', {
    defaultValue: ''
  })

  const [rangeMode, setRangeMode] = useQueryState('range', {
    defaultValue: 'month' as RangeMode
  })

  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assetsQuery.data ?? []

    const q = searchQuery.toLowerCase()

    return (assetsQuery.data ?? []).filter(asset =>
      asset.name.toLowerCase().includes(q)
    )
  }, [assetsQuery.data, searchQuery])

  const handleCreateCategory = useCallback(() => {
    open(ModifyAssetModal, {
      type: 'create'
    })
  }, [])

  useEffect(() => {
    if (hash === '#new') {
      handleCreateCategory()
    }
  }, [hash])

  return (
    <>
      <ModuleHeader
        icon="tabler:wallet"
        title="Assets"
        trailing={
          <>
            <Button
              display={{ base: 'none', sm: 'flex' }}
              icon="tabler:plus"
              tProps={{
                item: t('items.asset')
              }}
              onClick={handleCreateCategory}
            >
              new
            </Button>
            <ContextMenu
              componentProps={{
                menu: { minWidth: '15rem' }
              }}
            >
              <ContextMenuItem
                icon="tabler:refresh"
                label="Refresh"
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: forgeAPI.assets.key
                  })
                  assetsQuery.refetch()
                }}
              />
              <ContextMenuItem
                checked={isAmountHidden}
                icon="tabler:eye-off"
                label="Hide Amount"
                onClick={() => {
                  toggleAmountVisibility()
                }}
              />
            </ContextMenu>
          </>
        }
      />
      <Flex align="center" gap="md" mb="lg">
        <SearchInput
          searchTarget="asset"
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Listbox
          minWidth="14em"
          renderContent={() => (
            <Text whiteSpace="nowrap">{t(`rangeModes.${rangeMode}`)}</Text>
          )}
          value={rangeMode}
          onChange={setRangeMode}
        >
          {RANGE_OPTIONS.map(option => (
            <ListboxOption
              key={option}
              label={t(`rangeModes.${option}`)}
              value={option}
            />
          ))}
        </Listbox>
      </Flex>
      <WithQuery query={assetsQuery}>
        {() => (
          <>
            <Widget
              actionComponent={
                <TotalBalance
                  amount={totalBalance}
                  display={{ base: 'none', sm: 'flex' }}
                />
              }
              height="min-content"
              icon="tabler:currency-dollar"
              mb="lg"
              title="Total Assets"
            >
              <TotalBalance amount={totalBalance} display={{ sm: 'none' }} />
            </Widget>
            {filteredAssets.length > 0 ? (
              <Stack mb="2xl">
                {filteredAssets.map(asset => (
                  <AssetItem
                    key={asset.id}
                    asset={asset}
                    rangeMode={rangeMode as RangeMode}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyStateScreen
                icon="tabler:wallet-off"
                message={{
                  id: 'assets'
                }}
              />
            )}
            <FAB icon="tabler:plus" onClick={handleCreateCategory} />
          </>
        )}
      </WithQuery>
    </>
  )
}

export default Assets
