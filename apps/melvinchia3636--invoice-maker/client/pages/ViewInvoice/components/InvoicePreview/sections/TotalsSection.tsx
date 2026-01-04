import { useInvoiceViewer } from '../../../providers/InvoiceViewerProvider'

function TotalsSection() {
  const { invoice, currencySymbol, calculations } = useInvoiceViewer()

  return (
    <div className="ml-auto grid w-1/2 grid-cols-[1fr_auto_auto] gap-x-2 gap-y-2">
      <span className="text-zinc-500">Subtotal</span>
      <span className="text-right">{currencySymbol}</span>
      <span className="text-right tabular-nums">
        {calculations.subtotal.toLocaleString('en-MY', {
          minimumFractionDigits: 2
        })}
      </span>

      <span className="text-zinc-500">
        Tax {invoice.tax_type !== 'fixed' && `(${invoice.tax_amount}%)`}
      </span>
      <span className="text-right">{currencySymbol}</span>
      <span className="text-right tabular-nums">
        {calculations.taxAmount.toLocaleString('en-MY', {
          minimumFractionDigits: 2
        })}
      </span>

      {calculations.discountAmount > 0 && (
        <>
          <span className="text-zinc-500">
            Discount{' '}
            {invoice.discount_type === 'rate' &&
              `(${invoice.discount_amount}%)`}
          </span>
          <span className="text-right">-{currencySymbol}</span>
          <span className="text-right tabular-nums">
            {calculations.discountAmount.toLocaleString('en-MY', {
              minimumFractionDigits: 2
            })}
          </span>
        </>
      )}

      {(invoice.shipping_amount || 0) > 0 && (
        <>
          <span className="text-zinc-500">Shipping</span>
          <span className="text-right">{currencySymbol}</span>
          <span className="text-right tabular-nums">
            {invoice.shipping_amount.toLocaleString('en-MY', {
              minimumFractionDigits: 2
            })}
          </span>
        </>
      )}

      <span className="col-span-3 border-t border-zinc-200 pt-2"></span>

      <span className="font-semibold">Total</span>
      <span className="text-right font-semibold">{currencySymbol}</span>
      <span className="text-right font-semibold tabular-nums">
        {calculations.total.toLocaleString('en-MY', {
          minimumFractionDigits: 2
        })}
      </span>

      {(invoice.amount_paid || 0) > 0 && (
        <>
          <span className="text-zinc-500">Amount Paid</span>
          <span className="text-right">{currencySymbol}</span>
          <span className="text-right tabular-nums">
            {invoice.amount_paid.toLocaleString('en-MY', {
              minimumFractionDigits: 2
            })}
          </span>
        </>
      )}
    </div>
  )
}

export default TotalsSection
