import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

export const list = forgeController.query
    .description('Get all achievements entries by difficulty')
    .input({
        query: SCHEMAS.achievements.entries.pick({
            difficulty: true
        })
    })
    .callback(async ({ pb, query: { difficulty } }) =>
        pb.getFullList
            .collection('achievements__entries')
            .filter([
                {
                    field: 'difficulty',
                    operator: '=',
                    value: difficulty
                }
            ])
            .execute()
    )

export const create = forgeController.mutation
    .description('Create a new achievements entry')
    .input({
        body: SCHEMAS.achievements.entries.omit({
            created: true,
            updated: true
        })
    })
    .statusCode(201)
    .callback(({ pb, body }) =>
        pb.create.collection('achievements__entries').data(body).execute()
    )

export const update = forgeController.mutation
    .description('Update an existing achievements entry')
    .input({
        query: z.object({
            id: z.string()
        }),
        body: SCHEMAS.achievements.entries.omit({
            created: true,
            updated: true
        })
    })
    .existenceCheck('query', {
        id: 'achievements__entries'
    })
    .callback(({ pb, query: { id }, body }) =>
        pb.update
            .collection('achievements__entries')
            .id(id)
            .data(body)
            .execute()
    )

const remove = forgeController.mutation
    .description('Delete an existing achievements entry')
    .input({
        query: z.object({
            id: z.string()
        })
    })
    .existenceCheck('query', {
        id: 'achievements__entries'
    })
    .statusCode(204)
    .callback(({ pb, query: { id } }) =>
        pb.delete.collection('achievements__entries').id(id).execute()
    )

export default forgeRouter({
    list,
    create,
    update,
    remove
})
