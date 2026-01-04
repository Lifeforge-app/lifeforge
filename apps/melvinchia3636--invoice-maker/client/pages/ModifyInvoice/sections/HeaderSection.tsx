import type { InvoiceEntry } from '@'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { Button, TagChip, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { useParams } from 'shared'

import { STATUS_CONFIG } from '@/components/InvoiceCard'
import ModifyInvoiceMetadataModal from '@/modals/ModifyInvoiceMetadataModal'
import forgeAPI from '@/utils/forgeAPI'

import { useInvoiceEditor } from '../providers/InvoiceEditorProvider'

function Header() {
  const { id } = useParams<{ id?: string }>()

  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const open = useModalStore(state => state.open)

  const invoiceQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.invoices.getById
      .input({ id: id || '' })
      .queryOptions({ enabled: !!id })
  )

  const { isEditMode } = useInvoiceEditor()

  return (
    <header className="mt-4 mb-6">
      {isEditMode ? (
        <>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold sm:text-2xl">
              <span className="text-bg-500">{t(`items.invoice`)}</span> #
              {invoiceQuery.data?.invoice_number}
            </h1>
            <Button
              className="p-2!"
              icon="tabler:edit"
              variant="plain"
              onClick={() => {
                if (invoiceQuery.data) {
                  open(ModifyInvoiceMetadataModal, {
                    invoice: invoiceQuery.data as unknown as InvoiceEntry
                  })
                }
              }}
            />
          </div>
          <p className="text-bg-500 mt-1 flex items-center text-sm sm:text-base">
            {t(`sidebar.status`)}:
            <TagChip
              className="ml-2 inline-flex! text-sm sm:text-base"
              color={STATUS_CONFIG[invoiceQuery.data?.status || 'draft'].color}
              icon={STATUS_CONFIG[invoiceQuery.data?.status || 'draft'].icon}
              label={t(`statuses.${invoiceQuery.data?.status}`)}
            />
          </p>
        </>
      ) : (
        <h1 className="flex items-center gap-4 text-2xl font-semibold">
          <div className="flex-center bg-bg-500/20 text-bg-500 rounded-md p-3">
            <Icon className="size-6" icon="tabler:invoice" />
          </div>
          <span>{t('buttons.newInvoice')}</span>
        </h1>
      )}
    </header>
  )
}

export default Header
