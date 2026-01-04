import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  Card,
  DateInput,
  ListboxInput,
  ListboxOption,
  TextInput,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import ModifyClientModal from '@/modals/ModifyClientModal'
import forgeAPI from '@/utils/forgeAPI'

import { useInvoiceEditor } from '../providers/InvoiceEditorProvider'

function TopInfoSection() {
  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const open = useModalStore(state => state.open)

  const clientsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.clients.list.queryOptions()
  )

  const clients = clientsQuery.data || []

  const { formData, updateField } = useInvoiceEditor()

  return (
    <Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left side - Client */}
        <div className="min-w-0">
          <h3 className="text-bg-500 mb-2 text-sm font-medium">
            {t('inputs.billTo')}
          </h3>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <ListboxInput
              buttonContent={(() => {
                const targetClient = clients.find(
                  client => client.id === formData.bill_to
                )

                if (!targetClient) {
                  return (
                    <div className="text-bg-500 flex items-center gap-2">
                      <Icon className="size-5 shrink-0" icon="tabler:user" />
                      <span>Select Client</span>
                    </div>
                  )
                }

                return (
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className="size-5 shrink-0" icon="tabler:user" />
                    <span className="min-w-0 truncate">
                      {targetClient.name}
                    </span>
                  </div>
                )
              })()}
              className="min-w-0 flex-1"
              variant="plain"
              value={formData.bill_to}
              onChange={val => updateField('bill_to', val)}
            >
              {clients.map(client => (
                <ListboxOption
                  key={client.id}
                  icon="tabler:user"
                  label={client.name}
                  value={client.id}
                />
              ))}
            </ListboxInput>
            <Button
              icon="tabler:plus"
              tProps={{ item: '' }}
              variant="secondary"
              onClick={() => open(ModifyClientModal, { type: 'create' })}
            >
              New
            </Button>
          </div>
        </div>

        {/* Right side - Dates & Status */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-bg-500 mb-1 block text-sm">
                {t('inputs.date')}
              </label>
              <DateInput
                variant="plain"
                value={formData.date}
                onChange={val => val && updateField('date', val)}
              />
            </div>
            <div>
              <label className="text-bg-500 mb-1 block text-sm">
                {t('inputs.dueDate')}
              </label>
              <DateInput
                variant="plain"
                value={formData.due_date}
                onChange={val => val && updateField('due_date', val)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-bg-500 mb-1 block text-sm">
                {t('inputs.paymentTerms')}
              </label>
              <TextInput
                placeholder="Net 30"
                variant="plain"
                value={formData.payment_terms}
                onChange={e => updateField('payment_terms', e)}
              />
            </div>
            <div>
              <label className="text-bg-500 mb-1 block text-sm">
                {t('inputs.poNumber')}
              </label>
              <TextInput
                placeholder="Optional"
                variant="plain"
                value={formData.po_number}
                onChange={e => updateField('po_number', e)}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TopInfoSection
