import { useInvoiceViewer } from '../../../providers/InvoiceViewerProvider'

function LineItemsSection() {
  const { invoice, currencySymbol } = useInvoiceViewer()

  return (
    <div className="mb-8 overflow-hidden rounded-lg border border-zinc-200">
      <div className="grid grid-cols-12 gap-4 bg-black p-4 text-[14px] font-medium text-white">
        <div className="col-span-6">Item</div>
        <div className="col-span-2 text-center">Quantity</div>
        <div className="col-span-2 text-center">Rate</div>
        <div className="col-span-2 text-right">Amount</div>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {invoice.items?.map((item: any, index: number) => (
          <div key={index} className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-6">{item.description}</div>
            <div className="col-span-2 text-center">{item.quantity}</div>
            <div className="col-span-2 text-center">
              {currencySymbol}{' '}
              {item.rate.toLocaleString('en-MY', {
                minimumFractionDigits: 2
              })}
            </div>
            <div className="col-span-2 text-right">
              {currencySymbol}{' '}
              {(item.quantity * item.rate).toLocaleString('en-MY', {
                minimumFractionDigits: 2
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LineItemsSection
