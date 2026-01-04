import { useQuery } from '@tanstack/react-query'
import {
  Button,
  ContentWrapperWithSidebar,
  ContextMenuItem,
  EmptyStateScreen,
  FAB,
  LayoutWithSidebar,
  ModuleHeader,
  Scrollbar,
  SearchInput,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useMemo, useState } from 'react'
import { type InferOutput, useNavigate } from 'shared'

import InnerHeader from './components/InnerHeader'
import InvoiceCard, { STATUS_CONFIG } from './components/InvoiceCard'
import Sidebar from './components/Sidebar'
import ManageClientsModal from './modals/ManageClientsModal'
import ModifySettingsModal from './modals/ModifySettingsModal'
import forgeAPI from './utils/forgeAPI'

export type InvoiceEntry = InferOutput<
  typeof forgeAPI.melvinchia3636$invoice_maker.invoices.list
>[number]

function InvoiceMaker() {
  const navigate = useNavigate()

  const open = useModalStore(state => state.open)

  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const [clientFilter, setClientFilter] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')

  const invoicesQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.invoices.list
      .input({
        status: (statusFilter || undefined) as keyof typeof STATUS_CONFIG,
        clientId: clientFilter || undefined
      })
      .queryOptions()
  )

  const settingsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.settings.get.queryOptions()
  )

  const filteredInvoices = useMemo(() => {
    if (!invoicesQuery.data) return []

    if (!searchQuery) return invoicesQuery.data

    const query = searchQuery.toLowerCase()

    return invoicesQuery.data.filter(invoice => {
      const clientName = invoice.expand?.bill_to?.name?.toLowerCase() || ''

      return (
        invoice.invoice_number.toLowerCase().includes(query) ||
        clientName.includes(query)
      )
    })
  }, [invoicesQuery.data, searchQuery])

  const currencySymbol = settingsQuery.data?.currency_symbol || 'RM'

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            namespace="apps.melvinchia3636__invoiceMaker"
            onClick={() => navigate('/melvinchia3636--invoice-maker/modify')}
          >
            New Invoice
          </Button>
        }
        contextMenuProps={{
          children: (
            <>
              <ContextMenuItem
                icon="tabler:users"
                label="manageClients"
                namespace="apps.melvinchia3636__invoiceMaker"
                onClick={() => open(ManageClientsModal, {})}
              />
              <ContextMenuItem
                icon="tabler:settings"
                label="settings"
                namespace="apps.melvinchia3636__invoiceMaker"
                onClick={() => open(ModifySettingsModal, {})}
              />
            </>
          )
        }}
      />

      <LayoutWithSidebar>
        <Sidebar
          clientFilter={clientFilter}
          statusFilter={statusFilter}
          onClientFilterChange={setClientFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <ContentWrapperWithSidebar>
          <InnerHeader
            clientFilter={clientFilter}
            itemCount={filteredInvoices.length}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onClientFilterChange={setClientFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <div className="mt-4 mb-6">
            <SearchInput
              namespace="apps.melvinchia3636__invoiceMaker"
              searchTarget="invoice"
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <WithQuery query={invoicesQuery}>
            {data => {
              if (data.length === 0) {
                return (
                  <EmptyStateScreen
                    icon="tabler:file-off"
                    message={{
                      id: 'invoice',
                      namespace: 'apps.melvinchia3636__invoiceMaker'
                    }}
                  />
                )
              }

              return filteredInvoices.length === 0 ? (
                <EmptyStateScreen
                  icon="tabler:search-off"
                  message={{
                    id: 'search',
                    namespace: 'apps.melvinchia3636__invoiceMaker'
                  }}
                />
              ) : (
                <Scrollbar>
                  <div className="space-y-2 pb-8">
                    {filteredInvoices.map(invoice => (
                      <InvoiceCard
                        key={invoice.id}
                        currencySymbol={currencySymbol}
                        invoice={invoice}
                      />
                    ))}
                  </div>
                </Scrollbar>
              )
            }}
          </WithQuery>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>

      <FAB
        className="fixed right-6 bottom-6 md:hidden"
        icon="tabler:plus"
        onClick={() => navigate('/melvinchia3636--invoice-maker/modify')}
      />
    </>
  )
}

export default InvoiceMaker
