import { useQuery } from '@tanstack/react-query'
import {
  EmptyStateScreen,
  ModalHeader,
  Scrollbar,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { AutoSizer } from 'react-virtualized'

import forgeAPI from '@/utils/forgeAPI'

import ClientModal from '../ModifyClientModal'
import ClientItem from './components/ClientItem'

function ManageClientsModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const clientsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.clients.list.queryOptions()
  )

  return (
    <div className="flex min-h-[80vh] min-w-[40vw] flex-col">
      <ModalHeader
        actionButtonProps={{
          icon: 'tabler:plus',
          onClick: () => {
            open(ClientModal, {
              type: 'create'
            })
          }
        }}
        icon="tabler:users"
        namespace="apps.melvinchia3636__invoiceMaker"
        title="clients.manage"
        onClose={onClose}
      />
      <WithQuery query={clientsQuery}>
        {clients =>
          clients.length > 0 ? (
            <div className="mt-4 flex-1">
              <AutoSizer>
                {({ width, height }) => (
                  <Scrollbar
                    style={{
                      width,
                      height
                    }}
                  >
                    <ul className="space-y-3">
                      {clients.map(client => (
                        <ClientItem key={client.id} client={client} />
                      ))}
                    </ul>
                  </Scrollbar>
                )}
              </AutoSizer>
            </div>
          ) : (
            <div className="flex-center flex-1">
              <EmptyStateScreen
                CTAButtonProps={{
                  children: 'new',
                  icon: 'tabler:plus',
                  onClick: () => {
                    open(ClientModal, {
                      type: 'create'
                    })
                  },
                  tProps: { item: t('items.client') }
                }}
                icon="tabler:users-off"
                message={{
                  id: 'clients',
                  namespace: 'apps.melvinchia3636__invoiceMaker'
                }}
              />
            </div>
          )
        }
      </WithQuery>
    </div>
  )
}

export default ManageClientsModal
