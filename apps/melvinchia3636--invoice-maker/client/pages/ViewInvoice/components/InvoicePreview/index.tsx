import { forwardRef } from 'react'

import CompanyHeader from './sections/CompanyHeader'
import LineItemsSection from './sections/LineItemsSection'
import PaymentAndNotesSection from './sections/PaymentAndNotesSection'
import TopInfoSection from './sections/TopInfoSection'
import TotalsSection from './sections/TotalsSection'

const InvoicePreview = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="no-print-margin mx-auto w-full max-w-4xl pb-8 font-[Onest] text-black">
      <div
        ref={ref}
        className="aspect-[1/1.414] w-full rounded-lg bg-white p-12 shadow-lg print:shadow-none print:[--radius-2xl:1rem] print:[--radius-3xl:1.5rem] print:[--radius-lg:0.5rem] print:[--radius-md:0.375rem] print:[--radius-sm:0.125rem] print:[--radius-xl:0.75rem] print:**:[--spacing:0.25rem]"
      >
        <CompanyHeader />
        <TopInfoSection />
        <LineItemsSection />
        <div className="space-y-8">
          <TotalsSection />
          <PaymentAndNotesSection />
        </div>
      </div>
    </div>
  )
})

InvoicePreview.displayName = 'InvoicePreview'

export default InvoicePreview
