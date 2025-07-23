import { SchemaWithPB } from '@functions/database/PBService/typescript/pb_crud.interfaces'
import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const sessionCart = new Set<
  SchemaWithPB<z.infer<typeof SCHEMAS.virtual_wardrobe.entries>>
>()

const getCart = forgeController
  .route('GET /cart')
  .description('Get session cart items')
  .input({})
  .callback(async () => sessionCart)

const addToCart = forgeController
  .route('POST /cart/:id')
  .description('Add item to session cart')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    if (Array.from(sessionCart).some(item => item.id === id)) {
      throw new Error('Entry already in cart')
    }

    const item = await pb.getOne
      .collection('virtual_wardrobe__entries')
      .id(id)
      .execute()

    sessionCart.add(item)
  })

const removeFromCart = forgeController
  .route('DELETE /cart/:id')
  .description('Remove item from session cart')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(async ({ params: { id } }) => {
    const item = Array.from(sessionCart).find(item => item.id === id)

    if (!item) {
      throw new Error('Entry not in cart')
    }

    sessionCart.delete(item)
  })

const checkout = forgeController
  .route('POST /checkout')
  .description('Checkout session cart')
  .input({
    body: z.object({
      notes: z.string().max(500).optional()
    })
  })
  .callback(async ({ pb, body: { notes } }) => {
    const cart = Array.from(sessionCart)

    if (cart.length === 0) {
      throw new Error('Cart is empty')
    }

    const entryIds = cart.map(entry => entry.id)

    await pb.create
      .collection('virtual_wardrobe__histories')
      .data({
        entries: entryIds,
        notes
      })
      .execute()

    for (const entry of cart) {
      await pb.update
        .collection('virtual_wardrobe__entries')
        .id(entry.id)
        .data({
          'times_worn+': 1,
          last_worn: new Date()
        })
        .execute()
    }

    sessionCart.clear()
  })

const clearCart = forgeController
  .route('DELETE /cart')
  .description('Clear session cart')
  .input({})
  .callback(async () => {
    sessionCart.clear()
  })

export default forgeRouter({
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  clearCart
})
