import { useQuery } from '@tanstack/react-query'
import { Button, GoBackButton, TagChip } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { useReactToPrint } from 'react-to-print'
import { Link, useNavigate } from 'shared'

import { STATUS_CONFIG } from '@/components/InvoiceCard'
import forgeAPI from '@/utils/forgeAPI'

import { useInvoiceViewer } from '../providers/InvoiceViewerProvider'

function Header({
  invoiceRef
}: {
  invoiceRef: React.RefObject<HTMLDivElement | null>
}) {
  const navigate = useNavigate()

  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const { invoice } = useInvoiceViewer()

  const statusConfig = STATUS_CONFIG[invoice.status || 'draft']

  const fontQuery = useQuery(
    forgeAPI.user.personalization.getGoogleFont
      .input({
        family: 'Onest'
      })
      .queryOptions()
  )

  const documentTitle = `Invoice_${invoice?.invoice_number || ''}`

  const reactToPrintFn = useReactToPrint({
    contentRef: invoiceRef,
    fonts: fontQuery.data?.items?.length
      ? [
          {
            family: fontQuery.data.items[0].family,
            source: fontQuery.data.items[0].files.regular
          }
        ]
      : [],
    documentTitle
  })

  return (
    <>
      <GoBackButton onClick={() => navigate(-1)} />
      <header className="mt-4 mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              <span className="text-bg-500">{t(`items.invoice`)}</span> #
              {invoice.invoice_number}
            </h1>
            <TagChip
              className="text-xs!"
              color={statusConfig.color}
              icon={statusConfig.icon}
              label={t(`statuses.${invoice.status}`)}
            />
          </div>
          <p className="text-bg-500 mt-1">
            For {invoice.expand?.bill_to?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            as={Link}
            icon="tabler:pencil"
            to={`/melvinchia3636--invoice-maker/modify/${invoice.id}`}
            variant="secondary"
          >
            Edit
          </Button>
          <Button
            icon="tabler:printer"
            loading={fontQuery.isLoading}
            onClick={reactToPrintFn}
          >
            Print
          </Button>
        </div>
      </header>
    </>
  )
}

export default Header
