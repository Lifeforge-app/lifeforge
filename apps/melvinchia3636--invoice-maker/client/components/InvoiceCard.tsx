import type { InvoiceEntry } from '@'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  TagChip,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useNavigate, usePromiseLoading } from 'shared'
import COLORS from 'tailwindcss/colors'

import forgeAPI from '@/utils/forgeAPI'

export const STATUS_CONFIG = {
  draft: { color: COLORS.zinc[500], icon: 'tabler:file' },
  sent: { color: COLORS.blue[500], icon: 'tabler:send' },
  paid: { color: COLORS.green[500], icon: 'tabler:check' },
  overdue: {
    color: COLORS.red[500],
    icon: 'tabler:alert-circle'
  },
  cancelled: {
    color: COLORS.zinc[400],
    icon: 'tabler:ban'
  }
} as const

export default function InvoiceCard({
  invoice,
  currencySymbol
}: {
  invoice: InvoiceEntry
  currencySymbol: string
}) {
  const qc = useQueryClient()

  const open = useModalStore(state => state.open)

  const navigate = useNavigate()

  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const statusConfig = STATUS_CONFIG[invoice.status || 'draft']

  // Mutations
  const duplicateMutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.invoices.duplicate
      .input({
        id: invoice.id
      })
      .mutationOptions({
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['invoiceMaker', 'invoices'] })
        },
        onError: () => {
          toast.error('Failed to duplicate invoice')
        }
      })
  )

  const deleteMutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.invoices.remove
      .input({
        id: invoice.id
      })
      .mutationOptions({
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['invoiceMaker', 'invoices'] })
        },
        onError: () => {
          toast.error('Failed to delete invoice')
        }
      })
  )

  function handleDelete() {
    open(ConfirmationModal, {
      title: t('modals.deleteInvoice.title'),
      description: t('modals.deleteInvoice.message'),
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }

  const [loading, onDuplicate] = usePromiseLoading(async () => {
    await duplicateMutation.mutateAsync({})
  })

  return (
    <Card
      isInteractive
      className="flex-between gap-4"
      onClick={() => navigate(`/invoice-maker/view/${invoice.id}`)}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">#{invoice.invoice_number}</span>
          <TagChip
            className="py-0.5! text-xs!"
            color={statusConfig.color}
            icon={statusConfig.icon}
            iconClassName="size-3!"
            label={t(`statuses.${invoice.status}`)}
          />
        </div>
        <p className="text-bg-500 truncate text-sm">
          {invoice.expand?.bill_to?.name || 'No client'}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="font-semibold">
          {currencySymbol}{' '}
          {invoice.subtotal.toLocaleString('en-MY', {
            minimumFractionDigits: 2
          })}
        </p>
        <p className="text-bg-500 text-sm">
          {dayjs(invoice.date).format('MMM D, YYYY')}
        </p>
      </div>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          label="edit"
          onClick={() => navigate(`/invoice-maker/modify/${invoice.id}`)}
        />
        <ContextMenuItem
          icon="tabler:files"
          label="duplicate"
          loading={loading}
          namespace="apps.melvinchia3636__invoiceMaker"
          onClick={onDuplicate}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="delete"
          onClick={handleDelete}
        />
      </ContextMenu>
    </Card>
  )
}
