import { WithPB } from '@typescript/pocketbase_interfaces'
import PocketBase from 'pocketbase'

import { VirtualWardrobeCollectionsSchemas } from 'shared/types/collections'

const sessionCart = new Set<WithPB<VirtualWardrobeCollectionsSchemas.IEntry>>()

export const getSessionCart =
  (): WithPB<VirtualWardrobeCollectionsSchemas.IEntry>[] => {
    return Array.from(sessionCart)
  }

export const addToCart = async (
  pb: PocketBase,
  entryId: string
): Promise<void> => {
  if (Array.from(sessionCart).some(item => item.id === entryId)) {
    throw new Error('Entry already in cart')
  }

  const item = await pb
    .collection('virtual_wardrobe__entries')
    .getOne<WithPB<VirtualWardrobeCollectionsSchemas.IEntry>>(entryId)

  const processedItem = {
    ...item,
    front_image: pb.files.getURL(item, item.front_image).split('/files/')[1],
    back_image: pb.files.getURL(item, item.back_image).split('/files/')[1]
  }

  sessionCart.add(processedItem)
}

export const removeFromCart = (entryId: string): void => {
  const item = Array.from(sessionCart).find(item => item.id === entryId)

  if (!item) {
    throw new Error('Entry not in cart')
  }

  sessionCart.delete(item)
}

export const checkout = async (
  pb: PocketBase,
  notes: string
): Promise<void> => {
  const cart = Array.from(sessionCart)

  if (cart.length === 0) {
    throw new Error('Cart is empty')
  }

  const entryIds = cart.map(entry => entry.id)

  await pb.collection('virtual_wardrobe__histories').create({
    entries: entryIds,
    notes
  })

  for (const entry of cart) {
    await pb.collection('virtual_wardrobe__entries').update(entry.id, {
      'times_worn+': 1,
      last_worn: new Date()
    })
  }

  sessionCart.clear()
}

export const clearCart = (): void => {
  sessionCart.clear()
}
