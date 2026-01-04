import { useQuery } from '@tanstack/react-query'
import { Button, TagsFilter, useModuleSidebarState } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import forgeAPI from '@/utils/forgeAPI'

import { STATUS_CONFIG } from './InvoiceCard'

interface HeaderProps {
  itemCount: number
  statusFilter: string | null
  clientFilter: string | null
  searchQuery: string
  onStatusFilterChange: (status: string | null) => void
  onClientFilterChange: (clientId: string | null) => void
}

function InnerHeader({
  itemCount,
  statusFilter,
  clientFilter,
  searchQuery,
  onStatusFilterChange,
  onClientFilterChange
}: HeaderProps) {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const { setIsSidebarOpen } = useModuleSidebarState()

  const clientsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.clients.list.queryOptions()
  )

  const isFiltered =
    statusFilter !== null || clientFilter !== null || searchQuery.trim() !== ''

  return (
    <header>
      <div className="flex-between flex">
        <h1 className="text-3xl font-semibold">
          {t(`sidebar.${isFiltered ? 'filteredInvoices' : 'allInvoices'}`)}{' '}
          <span className="text-bg-500 text-base">({itemCount})</span>
        </h1>
        <Button
          className="lg:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </div>
      <TagsFilter
        availableFilters={{
          status: {
            isColored: true,
            data: Object.entries(STATUS_CONFIG).map(([key, config]) => ({
              id: key,
              label: t(`statuses.${key}`),
              icon: config.icon,
              color: config.color
            }))
          },
          client: {
            data:
              clientsQuery.data?.map(client => ({
                id: client.id,
                label: client.name,
                icon: 'tabler:user'
              })) ?? []
          }
        }}
        values={{
          status: statusFilter ?? '',
          client: clientFilter ?? ''
        }}
        onChange={{
          status: value =>
            onStatusFilterChange((value || null) as string | null),
          client: value =>
            onClientFilterChange((value || null) as string | null)
        }}
      />
    </header>
  )
}

export default InnerHeader
