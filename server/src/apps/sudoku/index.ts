import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { z } from 'zod/v4'

const generateBoard = forgeController
  .route('GET /:difficulty')
  .description('Generate 6 Sudoku boards by difficulty level')
  .schema({
    params: z.object({
      difficulty: z.enum(['easy', 'medium', 'hard', 'expert', 'evil'])
    }),
    query: z.object({
      count: z
        .string()
        .optional()
        .default('6')
        .transform(val => parseInt(val, 10) || 6)
    }),
    response: z.array(
      z.object({
        id: z.number(),
        mission: z.string(),
        solution: z.string(),
        win_rate: z.number()
      })
    )
  })
  .callback(async ({ params: { difficulty }, query: { count } }) => {
    const boards: any[] = []

    for (let i = 0; i < count; i++) {
      await fetch(`https://sudoku.com/api/v2/level/${difficulty}`, {
        method: 'GET',
        headers: {
          'x-easy-locale': 'en',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(async r => {
        await r
          .json()
          .then(data => {
            boards.push(data)
          })
          .catch(e => {
            throw new Error('Failed to parse response: ' + e.message)
          })
      })
    }

    return boards
  })

export default forgeRouter({ generateBoard })
