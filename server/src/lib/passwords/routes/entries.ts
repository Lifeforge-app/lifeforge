import {
  decrypt as _decrypt,
  decrypt2,
  encrypt,
  encrypt2
} from '@functions/auth/encryption'
import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { v4 } from 'uuid'
import { z } from 'zod/v4'

import { getDecryptedMaster } from '../utils/getDecryptedMaster'

export let challenge = v4()

setTimeout(() => {
  challenge = v4()
}, 1000 * 60)

const getChallenge = forgeController
  .query()
  .description('Get current challenge for password operations')
  .input({})
  .callback(async () => challenge)

const list = forgeController
  .query()
  .description('Get all password entries')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('passwords__entries')
      .sort(['-pinned', 'name'])
      .fields({
        id: true,
        name: true,
        icon: true,
        color: true,
        website: true,
        username: true,
        pinned: true,
        updated: true
      })
      .execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new password entry')
  .input({
    body: SCHEMAS.passwords.entries
      .omit({
        pinned: true,
        created: true,
        updated: true
      })
      .extend({
        master: z.string()
      })
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    const { master, password, ...rest } = body

    const decryptedMaster = await getDecryptedMaster(pb, master, challenge)

    const decryptedPassword = decrypt2(password, challenge)

    const encryptedPassword = encrypt(
      Buffer.from(decryptedPassword),
      decryptedMaster
    )

    await pb.create
      .collection('passwords__entries')
      .data({
        ...rest,
        password: encryptedPassword.toString('base64')
      })
      .execute()
  })

const update = forgeController
  .mutation()
  .description('Update a password entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.passwords.entries
      .omit({
        pinned: true,
        created: true,
        updated: true
      })
      .extend({
        master: z.string()
      })
  })
  .existenceCheck('query', {
    id: 'passwords__entries'
  })
  .callback(async ({ pb, query: { id }, body }) => {
    const { master, password, ...rest } = body

    const decryptedMaster = await getDecryptedMaster(pb, master, challenge)

    const decryptedPassword = decrypt2(password, challenge)

    const encryptedPassword = encrypt(
      Buffer.from(decryptedPassword),
      decryptedMaster
    )

    await pb.update
      .collection('passwords__entries')
      .id(id)
      .data({
        ...rest,
        password: encryptedPassword.toString('base64')
      })
      .execute()
  })

const decrypt = forgeController
  .mutation()
  .description('Decrypt a password entry')
  .input({
    query: z.object({
      id: z.string(),
      master: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'passwords__entries'
  })
  .callback(async ({ pb, query: { id, master } }) => {
    const decryptedMaster = await getDecryptedMaster(pb, master, challenge)

    const password = await pb.getOne
      .collection('passwords__entries')
      .id(id)
      .execute()

    const decryptedPassword = _decrypt(
      Buffer.from(password.password, 'base64'),
      decryptedMaster
    )

    return encrypt2(decryptedPassword.toString(), challenge)
  })

const remove = forgeController
  .mutation()
  .description('Delete a password entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'passwords__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('passwords__entries').id(id).execute()
  )

const togglePin = forgeController
  .mutation()
  .description('Toggle pin status of a password entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'passwords__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne
      .collection('passwords__entries')
      .id(id)
      .execute()

    await pb.update
      .collection('passwords__entries')
      .id(id)
      .data({
        pinned: !entry.pinned
      })
      .execute()
  })

export default forgeRouter({
  getChallenge,
  list,
  create,
  update,
  decrypt,
  remove,
  togglePin
})
