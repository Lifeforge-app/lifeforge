import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

interface LineItem {
  id?: string
  description: string
  quantity: number
  rate: number
  order: number
}

interface InvoiceFormData {
  bill_to: string
  date: Date
  due_date: Date
  payment_terms: string
  po_number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  shipping_address: string
  tax_type: 'rate' | 'fixed' | ''
  tax_amount: number
  discount_type: 'rate' | 'fixed' | ''
  discount_amount: number
  shipping_amount: number
  amount_paid: number
  notes: string
  items: LineItem[]
}

const INITIAL_FORM_DATA: InvoiceFormData = {
  bill_to: '',
  date: new Date(),
  due_date: dayjs().add(30, 'days').toDate(),
  payment_terms: 'Net 30',
  po_number: '',
  status: 'draft',
  shipping_address: '',
  tax_type: '',
  tax_amount: 0,
  discount_type: '',
  discount_amount: 0,
  shipping_amount: 0,
  amount_paid: 0,
  notes: '',
  items: [{ description: '', quantity: 1, rate: 0, order: 0 }]
}

interface InvoiceEditorContext {
  formData: InvoiceFormData
  updateField: <K extends keyof InvoiceFormData>(
    field: K,
    value: InvoiceFormData[K]
  ) => void
  addLineItem: () => void
  removeLineItem: (index: number) => void
  updateLineItem: (index: number, field: keyof LineItem, value: any) => void
  currencySymbol: string
  handleSubmit: () => Promise<void>
  isEditMode: boolean
  isLoading: boolean
  showDiscount: boolean
  setShowDiscount: (show: boolean) => void
  showTax: boolean
  setShowTax: (show: boolean) => void
  showShipping: boolean
  setShowShipping: (show: boolean) => void
  finalNumbers: {
    total: number
    subtotal: number
    balanceDue: number
  }
}

const InvoiceEditorContext = createContext<InvoiceEditorContext | null>(null)

function InvoiceEditorProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient()

  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const isEditMode = !!id

  const [formData, setFormData] = useState<InvoiceFormData>(INITIAL_FORM_DATA)

  const [showDiscount, setShowDiscount] = useState(false)

  const [showTax, setShowTax] = useState(false)

  const [showShipping, setShowShipping] = useState(false)

  const invoiceQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.invoices.getById
      .input({ id: id || '' })
      .queryOptions({ enabled: isEditMode })
  )

  const settingsQuery = useQuery(
    forgeAPI.melvinchia3636$invoice_maker.settings.get.queryOptions()
  )

  const createMutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.invoices.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['invoiceMaker', 'invoices'] })
        toast.success(t('toast.invoiceCreated'))
        navigate('/melvinchia3636--invoice-maker')
      }
    })
  )

  const updateMutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.invoices.update
      .input({
        id: id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['invoiceMaker', 'invoices'] })
          toast.success(t('toast.invoiceUpdated'))
          navigate('/melvinchia3636--invoice-maker')
        }
      })
  )

  const isLoading = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (invoiceQuery.data) {
      setFormData({
        bill_to: invoiceQuery.data.bill_to || '',
        date: new Date(invoiceQuery.data.date),
        due_date: new Date(invoiceQuery.data.due_date),
        payment_terms: invoiceQuery.data.payment_terms || '',
        po_number: invoiceQuery.data.po_number || '',
        status: invoiceQuery.data.status || 'draft',
        shipping_address: invoiceQuery.data.shipping_address || '',
        tax_type: invoiceQuery.data.tax_type || '',
        tax_amount: invoiceQuery.data.tax_amount || 0,
        discount_type: invoiceQuery.data.discount_type || '',
        discount_amount: invoiceQuery.data.discount_amount || 0,
        shipping_amount: invoiceQuery.data.shipping_amount || 0,
        amount_paid: invoiceQuery.data.amount_paid || 0,
        notes: invoiceQuery.data.notes || '',
        items:
          invoiceQuery.data.items?.length > 0
            ? invoiceQuery.data.items.map(item => ({
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                order: item.order
              }))
            : [{ description: '', quantity: 1, rate: 0, order: 0 }]
      })

      // Initialize toggle states based on existing data
      if (
        invoiceQuery.data.discount_type &&
        invoiceQuery.data.discount_amount > 0
      ) {
        setShowDiscount(true)
      }

      if (invoiceQuery.data.tax_type && invoiceQuery.data.tax_amount > 0) {
        setShowTax(true)
      }

      if (invoiceQuery.data.shipping_amount > 0) {
        setShowShipping(true)
      }
    }
  }, [invoiceQuery.data])

  useEffect(() => {
    if (!isEditMode && settingsQuery.data) {
      setFormData(prev => ({
        ...prev,
        payment_terms:
          settingsQuery.data.default_payment_terms || prev.payment_terms,
        notes: settingsQuery.data.default_notes || prev.notes,
        tax_type: settingsQuery.data.default_tax_rate ? 'rate' : '',
        tax_amount: settingsQuery.data.default_tax_rate || 0
      }))
    }
  }, [isEditMode, settingsQuery.data])

  const updateField = useCallback(
    <K extends keyof InvoiceFormData>(field: K, value: InvoiceFormData[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }))
    },
    []
  )

  const addLineItem = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { description: '', quantity: 1, rate: 0, order: prev.items.length }
      ]
    }))
  }, [])

  const removeLineItem = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i }))
    }))
  }, [])

  const updateLineItem = useCallback(
    (index: number, field: keyof LineItem, value: any) => {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }))
    },
    []
  )

  const currencySymbol = settingsQuery.data?.currency_symbol || 'RM'

  const handleSubmit = async () => {
    const payload = {
      bill_to: formData.bill_to || undefined,
      date: formData.date.toISOString(),
      due_date: formData.due_date.toISOString(),
      payment_terms: formData.payment_terms,
      po_number: formData.po_number,
      status: formData.status,
      shipping_address: formData.shipping_address,
      tax_type: formData.tax_type || undefined,
      tax_amount: formData.tax_amount,
      discount_type: formData.discount_type || undefined,
      discount_amount: formData.discount_amount,
      shipping_amount: formData.shipping_amount,
      amount_paid: formData.amount_paid,
      notes: formData.notes,
      items: formData.items.filter(item => item.description.trim() !== '')
    }

    if (isEditMode) {
      await updateMutation.mutateAsync(payload)
    } else {
      await createMutation.mutateAsync(payload)
    }
  }

  const finalNumbers = useMemo(() => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    )

    const taxAmount =
      formData.tax_type === 'rate'
        ? subtotal * (formData.tax_amount / 100)
        : formData.tax_type === 'fixed'
          ? formData.tax_amount
          : 0

    const discountAmount =
      formData.discount_type === 'rate'
        ? subtotal * (formData.discount_amount / 100)
        : formData.discount_type === 'fixed'
          ? formData.discount_amount
          : 0

    const total =
      subtotal + taxAmount - discountAmount + formData.shipping_amount

    const balanceDue = total - formData.amount_paid

    return {
      total,
      subtotal,
      balanceDue
    }
  }, [formData])

  const memoizedValue = useMemo(
    () => ({
      formData,
      currencySymbol,
      isEditMode,
      isLoading,
      updateField,
      addLineItem,
      removeLineItem,
      updateLineItem,
      handleSubmit,
      showDiscount,
      setShowDiscount,
      showTax,
      setShowTax,
      showShipping,
      setShowShipping,
      finalNumbers
    }),
    [
      formData,
      currencySymbol,
      isEditMode,
      isLoading,
      showDiscount,
      showTax,
      showShipping,
      finalNumbers
    ]
  )

  return (
    <InvoiceEditorContext value={memoizedValue}>
      {children}
    </InvoiceEditorContext>
  )
}

export default InvoiceEditorProvider

export function useInvoiceEditor() {
  const context = useContext(InvoiceEditorContext)

  if (!context) {
    throw new Error(
      'useInvoiceEditor must be used within an InvoiceEditorProvider'
    )
  }

  return context
}
