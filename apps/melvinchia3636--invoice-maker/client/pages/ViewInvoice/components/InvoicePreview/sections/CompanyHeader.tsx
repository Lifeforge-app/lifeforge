import forgeAPI from '@/utils/forgeAPI'

import { useInvoiceViewer } from '../../../providers/InvoiceViewerProvider'

function CompanyHeader() {
  const { invoice, settings } = useInvoiceViewer()

  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        {settings.default_logo && (
          <img
            alt="Logo"
            className="mb-2 h-16 w-auto"
            src={
              forgeAPI.media.input({
                collectionId: settings.collectionId,
                recordId: settings.id,
                fieldId: settings.default_logo
              }).endpoint
            }
          />
        )}
        <p className="text-[18px] font-semibold">{settings.company_name}</p>
        <p className="mt-1 whitespace-pre-wrap">
          {settings.company_additional_info}
        </p>
      </div>
      <div className="text-right">
        <h1 className="text-[36px] font-light tracking-wide">INVOICE</h1>
        <p className="text-[16px] font-medium text-zinc-500">
          #{invoice.invoice_number}
        </p>
      </div>
    </div>
  )
}

export default CompanyHeader
