import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

const ENDPOINT = {
  latest: 'https://www.sinchew.com.my/ajx-api/latest_posts/?',
  headline:
    'https://www.sinchew.com.my/ajx-api/category_posts/?cat=640&nooffset=true&editorialcat=0&posts_per_pages=10&'
}

const list = forgeController.query
  .description('Get latest news from Sin Chew')
  .input({
    query: z.object({
      type: z.enum(['latest', 'headline']),
      page: z.number().min(1).default(1)
    })
  })
  .callback(async ({ query: { page, type } }) => {
    const targetEndpoint = ENDPOINT[type]

    const response = await fetch(
      `${targetEndpoint}${page === 1 ? '' : `?page=${page}`}`
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
  list
})
