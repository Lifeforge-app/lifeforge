import dayjs from 'dayjs'

import { useInvoiceViewer } from '../../../providers/InvoiceViewerProvider'

function TopInfoSection() {
  const { invoice, currencySymbol, calculations } = useInvoiceViewer()

  return (
    <div className="mb-8 grid grid-cols-2 gap-8">
      <div>
        <h3 className="mb-2 text-[14px] font-medium text-zinc-500">Bill To:</h3>
        {invoice.expand?.bill_to ? (
          <>
            <p className="text-[18px] font-semibold">
              {invoice.expand.bill_to.name}
            </p>
            <p className="mt-1 whitespace-pre-wrap">
              {invoice.expand.bill_to.address}
            </p>
          </>
        ) : (
          <p className="text-zinc-400 italic">No client specified</p>
        )}
      </div>
      <div className="space-y-2 text-right">
        <div className="flex justify-between">
          <span className="text-zinc-500">Date:</span>
          <span>{dayjs(invoice.date).format('MMM D, YYYY')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Payment Terms:</span>
          <span>{invoice.payment_terms || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Due Date:</span>
          <span>{dayjs(invoice.due_date).format('MMM D, YYYY')}</span>
        </div>
        {invoice.po_number && (
          <div className="flex justify-between">
            <span className="text-zinc-500">PO Number:</span>
            <span>{invoice.po_number}</span>
          </div>
        )}
        <div className="mt-6 flex justify-between text-[20px] font-semibold">
          <span>Balance Due:</span>
          <span>
            {currencySymbol}{' '}
            {calculations.balanceDue.toLocaleString('en-MY', {
              minimumFractionDigits: 2
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TopInfoSection
