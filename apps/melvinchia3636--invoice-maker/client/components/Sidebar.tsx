import { useQuery } from '@tanstack/react-query'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import ManageClientsModal from '@/modals/ManageClientsModal'
import forgeAPI from '@/utils/forgeAPI'

import { STATUS_CONFIG } from './InvoiceCard'

interface SidebarProps {
  statusFilter: string | null
  onStatusFilterChange: (status: string | null) => void
  clientFilter: string | null
  onClientFilterChange: (clientId: string | null) => void
}

export default function Sidebar({
  statusFilter,
  onStatusFilterChange,
  clientFilter,
  onClientFilterChange
}: SidebarProps) {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const open = useModalStore(state => state.open)

  const clientsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.clients.list.queryOptions()
  )

  return (
    <SidebarWrapper>
      <SidebarItem
        active={statusFilter === null && clientFilter === null}
        icon="tabler:file-invoice"
        label="All Invoices"
        namespace="apps.melvinchia3636__invoiceMaker"
        onClick={() => {
          onStatusFilterChange(null)
          onClientFilterChange(null)
        }}
      />
      <SidebarDivider />
      <SidebarTitle label={t('sidebar.status')} />
      {Object.entries(STATUS_CONFIG).map(([key, value]) => (
        <SidebarItem
          key={key}
          active={statusFilter === key}
          icon={value.icon}
          label={t(`statuses.${key}`)}
          namespace="apps.melvinchia3636__invoiceMaker"
          sideStripColor={value.color}
          onCancelButtonClick={() => onStatusFilterChange(null)}
          onClick={() => onStatusFilterChange(key)}
        />
      ))}
      <SidebarDivider />
      <SidebarTitle
        actionButton={{
          icon: 'tabler:settings',
          onClick: () => {
            open(ManageClientsModal, {})
          }
        }}
        label={t('sidebar.clients')}
      />
      <WithQuery query={clientsQuery}>
        {clients => (
          <>
            {clients.length > 0 ? (
              <>
                <SidebarItem
                  active={clientFilter === null}
                  icon="tabler:users"
                  label={t('sidebar.allClients')}
                  onClick={() => onClientFilterChange(null)}
                />
                {clients.map(client => (
                  <SidebarItem
                    key={client.id}
                    active={clientFilter === client.id}
                    icon="tabler:user"
                    label={client.name}
                    onCancelButtonClick={() => onClientFilterChange(null)}
                    onClick={() => onClientFilterChange(client.id)}
                  />
                ))}
              </>
            ) : (
              <p className="text-bg-500 text-center">No clients found</p>
            )}
          </>
        )}
      </WithQuery>
    </SidebarWrapper>
  )
}
