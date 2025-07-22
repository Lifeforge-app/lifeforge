import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as sessionService from '../services/session.service'

const getCart = forgeController
  .route('GET /cart')
  .description('Get session cart items')
  .input({})
  .callback(async () => sessionService.getSessionCart())

const addToCart = forgeController
  .route('POST /cart/:id')
  .description('Add item to session cart')
  .input({})
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    await sessionService.addToCart(pb, id)
  })

const removeFromCart = forgeController
  .route('DELETE /cart/:id')
  .description('Remove item from session cart')
  .input({})
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(async ({ params: { id } }) => {
    sessionService.removeFromCart(id)
  })

const checkout = forgeController
  .route('POST /checkout')
  .description('Checkout session cart')
  .input({})
  .callback(async ({ pb, body: { notes } }) => {
    await sessionService.checkout(pb, notes)
  })

const clearCart = forgeController
  .route('DELETE /cart')
  .description('Clear session cart')
  .input({})
  .callback(async () => {
    sessionService.clearCart()
  })

export default forgeRouter({
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  clearCart
})
