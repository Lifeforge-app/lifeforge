import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

const listLatest = forgeController.query
  .description('Get latest news from Sin Chew')
  .input({
    query: z.object({
      page: z.number().min(1).default(1)
    })
  })
  .callback(async ({ query: { page } }) => {
    const response = await fetch(
      `https://www.sinchew.com.my/ajx-api/latest_posts/?page=${page}`
    )

    const data = await response.json()

    return data.map((item: any) => ({
      id: item.ID,
      time_display: item.time_display,
      category: item.cat,
      title: item.title,
      excerpt: item.excerpt,
      image: item.image
    })) as Array<{
      id: number
      time_display: string
      category: string
      title: string
      excerpt: string
      image: string
    }>
  })

export default forgeRouter({
  listLatest
})
