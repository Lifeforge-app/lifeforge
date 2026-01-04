import { useQuery } from '@tanstack/react-query'
import { WithQuery } from 'lifeforge-ui'
import { createContext, useContext, useMemo } from 'react'
import type { InferOutput } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

type Invoice = InferOutput<
  typeof forgeAPI.melvinchia3636$invoice_maker.invoices.getById
>
type Settings = InferOutput<
  typeof forgeAPI.melvinchia3636$invoice_maker.settings.get
>

interface InvoiceViewerContext {
  invoice: Invoice
  settings: Settings
  currencySymbol: string
  calculations: {
    subtotal: number
    taxAmount: number
    discountAmount: number
    total: number
    balanceDue: number
  }
}

const InvoiceViewerContext = createContext<InvoiceViewerContext | null>(null)

interface InvoiceViewerProviderProps {
  invoiceId: string
  children: React.ReactNode
}

function InvoiceViewerProvider({
  invoiceId,
  children
}: InvoiceViewerProviderProps) {
  const invoiceQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.invoices.getById
      .input({ id: invoiceId })
      .queryOptions()
  )

  const settingsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.settings.get.queryOptions()
  )

  const calculations = useMemo(() => {
    if (!invoiceQuery.data) {
      return {
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
        balanceDue: 0
      }
    }

    const invoice = invoiceQuery.data

    const subtotal =
      invoice.items?.reduce(
        (sum: number, item: any) => sum + item.quantity * item.rate,
        0
      ) || 0

    const taxAmount =
      invoice.tax_type === 'rate'
        ? subtotal * (invoice.tax_amount / 100)
        : invoice.tax_type === 'fixed'
          ? invoice.tax_amount
          : 0

    const discountAmount =
      invoice.discount_type === 'rate'
        ? subtotal * (invoice.discount_amount / 100)
        : invoice.discount_type === 'fixed'
          ? invoice.discount_amount
          : 0

    const total =
      subtotal + taxAmount - discountAmount + (invoice.shipping_amount || 0)

    const balanceDue = total - (invoice.amount_paid || 0)

    return {
      subtotal,
      taxAmount,
      discountAmount,
      total,
      balanceDue
    }
  }, [invoiceQuery.data])

  const currencySymbol = settingsQuery.data?.currency_symbol || 'RM'

  return (
    <WithQuery query={invoiceQuery}>
      {invoice => (
        <WithQuery query={settingsQuery}>
          {settings => (
            <InvoiceViewerContext.Provider
              value={{ invoice, settings, currencySymbol, calculations }}
            >
              {children}
            </InvoiceViewerContext.Provider>
          )}
        </WithQuery>
      )}
    </WithQuery>
  )
}

export default InvoiceViewerProvider

export function useInvoiceViewer() {
  const context = useContext(InvoiceViewerContext)

  if (!context) {
    throw new Error(
      'useInvoiceViewer must be used within an InvoiceViewerProvider'
    )
  }

  return context
}
