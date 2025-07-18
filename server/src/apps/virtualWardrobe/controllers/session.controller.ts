import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { VirtualWardrobeControllersSchemas } from 'shared/types/controllers'

import * as sessionService from '../services/session.service'

const virtualWardrobeSessionRouter = express.Router()

const getCart = forgeController
  .route('GET /cart')
  .description('Get session cart items')
  .schema(VirtualWardrobeControllersSchemas.Session.getCart)
  .callback(async () => sessionService.getSessionCart())

const addToCart = forgeController
  .route('POST /cart/:id')
  .description('Add item to session cart')
  .schema(VirtualWardrobeControllersSchemas.Session.addToCart)
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    await sessionService.addToCart(pb, id)
  })

const removeFromCart = forgeController
  .route('DELETE /cart/:id')
  .description('Remove item from session cart')
  .schema(VirtualWardrobeControllersSchemas.Session.removeFromCart)
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(async ({ params: { id } }) => {
    sessionService.removeFromCart(id)
  })

const checkout = forgeController
  .route('POST /checkout')
  .description('Checkout session cart')
  .schema(VirtualWardrobeControllersSchemas.Session.checkout)
  .callback(async ({ pb, body: { notes } }) => {
    await sessionService.checkout(pb, notes)
  })

const clearCart = forgeController
  .route('DELETE /cart')
  .description('Clear session cart')
  .schema(VirtualWardrobeControllersSchemas.Session.clearCart)
  .callback(async () => {
    sessionService.clearCart()
  })

bulkRegisterControllers(virtualWardrobeSessionRouter, [
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  clearCart
])

export default virtualWardrobeSessionRouter
