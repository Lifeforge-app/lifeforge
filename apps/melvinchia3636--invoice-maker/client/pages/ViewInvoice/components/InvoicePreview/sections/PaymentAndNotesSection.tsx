import { useInvoiceViewer } from '../../../providers/InvoiceViewerProvider'

function PaymentAndNotesSection() {
  const { invoice, settings } = useInvoiceViewer()

  return (
    <>
      {(settings.bank_name || settings.bank_account) && (
        <div>
          <h3 className="mb-2 text-[14px] font-medium text-zinc-500">
            Payment Information:
          </h3>
          {settings.bank_name && (
            <p>
              Bank: <span className="font-medium">{settings.bank_name}</span>
            </p>
          )}
          {settings.bank_account && (
            <p>
              A/C No.:{' '}
              <span className="font-medium">{settings.bank_account}</span>
            </p>
          )}
        </div>
      )}

      {invoice.notes && (
        <div>
          <h3 className="mb-2 text-[14px] font-medium text-zinc-500">Notes:</h3>
          <p className="whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}
    </>
  )
}

export default PaymentAndNotesSection
