import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'

const list = forgeController
  .query()
  .description('List all invoices')
  .input({
    query: z.object({
      status: z
        .enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
        .optional(),
      clientId: z.string().optional()
    })
  })
  .callback(async ({ pb, query }) => {
    let builder = pb.getFullList
      .collection('melvinchia3636$invoice_maker__invoices_aggregated')
      .sort(['-date', '-created'])
      .expand({
        bill_to: 'melvinchia3636$invoice_maker__clients'
      })

    if (query?.status) {
      builder = builder.filter([
        { field: 'status', operator: '=', value: query.status }
      ])
    }

    if (query?.clientId) {
      builder = builder.filter([
        { field: 'bill_to', operator: '=', value: query.clientId }
      ])
    }

    return builder.execute()
  })

const getById = forgeController
  .query()
  .description('Get invoice by ID with items')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__invoices'
  })
  .callback(async ({ pb, query: { id } }) => {
    const invoice = await pb.getOne
      .collection('melvinchia3636$invoice_maker__invoices')
      .id(id)
      .expand({
        bill_to: 'melvinchia3636$invoice_maker__clients'
      })
      .execute()

    const items = await pb.getFullList
      .collection('melvinchia3636$invoice_maker__items')
      .filter([{ field: 'invoice', operator: '=', value: id }])
      .sort(['order'])
      .execute()

    return { ...invoice, items }
  })

const create = forgeController
  .mutation()
  .description('Create a new invoice')
  .input({
    body: z.object({
      bill_to: z.string().optional(),
      date: z.string(),
      due_date: z.string(),
      payment_terms: z.string().optional(),
      po_number: z.string().optional(),
      status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
      shipping_address: z.string().optional(),
      tax_type: z.enum(['rate', 'fixed']).optional(),
      tax_amount: z.number().optional(),
      discount_type: z.enum(['rate', 'fixed']).optional(),
      discount_amount: z.number().optional(),
      shipping_amount: z.number().optional(),
      amount_paid: z.number().optional(),
      notes: z.string().optional(),
      items: z
        .array(
          z.object({
            description: z.string(),
            quantity: z.number(),
            rate: z.number(),
            order: z.number()
          })
        )
        .optional()
    })
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    const { items, ...invoiceData } = body

    // Get settings to auto-generate invoice number
    const settings = await pb.getFullList
      .collection('melvinchia3636$invoice_maker__settings')
      .execute()

    let invoiceNumber = '001'

    if (settings.length > 0) {
      const prefix = settings[0].invoice_prefix || ''

      const nextNum = settings[0].next_invoice_number || 1

      invoiceNumber = `${prefix}${String(nextNum).padStart(3, '0')}`

      // Increment next invoice number
      await pb.update
        .collection('melvinchia3636$invoice_maker__settings')
        .id(settings[0].id)
        .data({ next_invoice_number: nextNum + 1 })
        .execute()
    }

    // Create the invoice
    const invoice = await pb.create
      .collection('melvinchia3636$invoice_maker__invoices')
      .data({
        ...invoiceData,
        invoice_number: invoiceNumber
      })
      .execute()

    // Create line items if provided
    if (items && items.length > 0) {
      await Promise.all(
        items.map(item =>
          pb.create
            .collection('melvinchia3636$invoice_maker__items')
            .data({
              ...item,
              invoice: invoice.id
            })
            .execute()
        )
      )
    }

    return invoice
  })

const update = forgeController
  .mutation()
  .description('Update an existing invoice')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      invoice_number: z.string().optional(),
      bill_to: z.string().optional(),
      date: z.string().optional(),
      due_date: z.string().optional(),
      payment_terms: z.string().optional(),
      po_number: z.string().optional(),
      status: z
        .enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
        .optional(),
      shipping_address: z.string().optional(),
      tax_type: z.enum(['rate', 'fixed']).optional(),
      tax_amount: z.number().optional(),
      discount_type: z.enum(['rate', 'fixed']).optional(),
      discount_amount: z.number().optional(),
      shipping_amount: z.number().optional(),
      amount_paid: z.number().optional(),
      notes: z.string().optional(),
      items: z
        .array(
          z.object({
            id: z.string().optional(),
            description: z.string(),
            quantity: z.number(),
            rate: z.number(),
            order: z.number()
          })
        )
        .optional()
    })
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__invoices'
  })
  .callback(async ({ pb, query: { id }, body }) => {
    const { items, ...invoiceData } = body

    // Update the invoice
    const invoice = await pb.update
      .collection('melvinchia3636$invoice_maker__invoices')
      .id(id)
      .data(invoiceData)
      .execute()

    // Handle items if provided
    if (items !== undefined) {
      // Get existing items
      const existingItems = await pb.getFullList
        .collection('melvinchia3636$invoice_maker__items')
        .filter([{ field: 'invoice', operator: '=', value: id }])
        .execute()

      const existingIds = new Set(existingItems.map(item => item.id))

      const newItemIds = new Set(
        items.filter(item => item.id).map(item => item.id)
      )

      // Delete items that are no longer in the list
      const toDelete = existingItems.filter(item => !newItemIds.has(item.id))

      await Promise.all(
        toDelete.map(item =>
          pb.delete
            .collection('melvinchia3636$invoice_maker__items')
            .id(item.id)
            .execute()
        )
      )

      // Update or create items
      await Promise.all(
        items.map(item => {
          if (item.id && existingIds.has(item.id)) {
            // Update existing item
            return pb.update
              .collection('melvinchia3636$invoice_maker__items')
              .id(item.id)
              .data({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                order: item.order
              })
              .execute()
          } else {
            // Create new item
            return pb.create
              .collection('melvinchia3636$invoice_maker__items')
              .data({
                invoice: id,
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                order: item.order
              })
              .execute()
          }
        })
      )
    }

    return invoice
  })

const remove = forgeController
  .mutation()
  .description('Delete an invoice')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__invoices'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete
      .collection('melvinchia3636$invoice_maker__invoices')
      .id(id)
      .execute()
  )

const duplicate = forgeController
  .mutation()
  .description('Duplicate an existing invoice')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__invoices'
  })
  .statusCode(201)
  .callback(async ({ pb, query: { id } }) => {
    // Get the original invoice
    const original = await pb.getOne
      .collection('melvinchia3636$invoice_maker__invoices')
      .id(id)
      .execute()

    // Get the original items
    const originalItems = await pb.getFullList
      .collection('melvinchia3636$invoice_maker__items')
      .filter([{ field: 'invoice', operator: '=', value: id }])
      .sort(['order'])
      .execute()

    // Get settings for new invoice number
    const settings = await pb.getFullList
      .collection('melvinchia3636$invoice_maker__settings')
      .execute()

    let invoiceNumber = '001'

    if (settings.length > 0) {
      const prefix = settings[0].invoice_prefix || ''

      const nextNum = settings[0].next_invoice_number || 1

      invoiceNumber = `${prefix}${String(nextNum).padStart(3, '0')}`

      // Increment next invoice number
      await pb.update
        .collection('melvinchia3636$invoice_maker__settings')
        .id(settings[0].id)
        .data({ next_invoice_number: nextNum + 1 })
        .execute()
    }

    // Create the new invoice
    const newInvoice = await pb.create
      .collection('melvinchia3636$invoice_maker__invoices')
      .data({
        invoice_number: invoiceNumber,
        bill_to: original.bill_to,
        date: new Date().toISOString(),
        due_date: original.due_date,
        payment_terms: original.payment_terms,
        po_number: '',
        status: 'draft',
        shipping_address: original.shipping_address,
        tax_type: original.tax_type,
        tax_amount: original.tax_amount,
        discount_type: original.discount_type,
        discount_amount: original.discount_amount,
        shipping_amount: original.shipping_amount,
        amount_paid: 0,
        notes: original.notes
      })
      .execute()

    // Duplicate items
    await Promise.all(
      originalItems.map(item =>
        pb.create
          .collection('melvinchia3636$invoice_maker__items')
          .data({
            invoice: newInvoice.id,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            order: item.order
          })
          .execute()
      )
    )

    return newInvoice
  })

export default forgeRouter({
  list,
  getById,
  create,
  update,
  remove,
  duplicate
})
