import { useRef } from 'react'
import { useParams } from 'shared'

import Header from './components/Header'
import InvoicePreview from './components/InvoicePreview'
import InvoiceViewerProvider from './providers/InvoiceViewerProvider'

function ViewInvoiceContent() {
  const invoiceRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Header invoiceRef={invoiceRef} />
      <InvoicePreview ref={invoiceRef} />
    </>
  )
}

export default function ViewInvoice() {
  const { id } = useParams<{ id: string }>()

  return (
    <InvoiceViewerProvider invoiceId={id!}>
      <ViewInvoiceContent />
    </InvoiceViewerProvider>
  )
}
