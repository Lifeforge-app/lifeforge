import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

function getCategoryPostsEndpoint(catNumber: number) {
  return {
    root: 'https://www.sinchew.com.my/ajx-api/category_posts',
    defaultQuery: new URLSearchParams({
      cat: catNumber.toString()
    })
  }
}

const ENDPOINT = {
  latest: {
    root: 'https://www.sinchew.com.my/ajx-api/latest_posts',
    defaultQuery: new URLSearchParams({})
  },
  headline: getCategoryPostsEndpoint(640),
  hot: {
    root: 'https://www.sinchew.com.my/hot-post-list/',
    defaultQuery: new URLSearchParams({
      taxid: '-1'
    })
  },
  'domestic:latest': getCategoryPostsEndpoint(446),
  'domestic:realtime': getCategoryPostsEndpoint(471),
  'domestic:editor-choice': getCategoryPostsEndpoint(116367),
  'domestic:hot': getCategoryPostsEndpoint(453),
  'domestic:society': getCategoryPostsEndpoint(455),
  'domestic:education': getCategoryPostsEndpoint(456),
  'domestic:chinese-society': getCategoryPostsEndpoint(469),
  'domestic:headline': getCategoryPostsEndpoint(447),
  'domestic:warm-action': getCategoryPostsEndpoint(448),
  'domestic:mixed': getCategoryPostsEndpoint(457),
  'domestic:politics': getCategoryPostsEndpoint(454),
  'domestic:truth-seeking': getCategoryPostsEndpoint(459),
  'international:latest': getCategoryPostsEndpoint(502),
  'international:worldwide': getCategoryPostsEndpoint(497),
  'international:headline': getCategoryPostsEndpoint(118761),
  'international:international-platter': getCategoryPostsEndpoint(498),
  'international:explore-the-world': getCategoryPostsEndpoint(499),
  'finance:latest': getCategoryPostsEndpoint(9),
  'finance:spotlight': getCategoryPostsEndpoint(20),
  'finance:international': getCategoryPostsEndpoint(27),
  'entertainment:latest': getCategoryPostsEndpoint(382),
  'entertainment:foreign': getCategoryPostsEndpoint(385),
  'entertainment:msia': getCategoryPostsEndpoint(383),
  'local:johor:focus': getCategoryPostsEndpoint(287),
  'local:johor:singapore': getCategoryPostsEndpoint(82543),
  'local:johor:eye': getCategoryPostsEndpoint(78225),
  'local:johor:mixed': getCategoryPostsEndpoint(327440),
  'local:metropolis:headline': getCategoryPostsEndpoint(223),
  'local:metropolis:dynamic': getCategoryPostsEndpoint(212),
  'local:metropolis:interesting': getCategoryPostsEndpoint(874),
  'local:metropolis:story': getCategoryPostsEndpoint(112),
  'local:metropolis:perspective': getCategoryPostsEndpoint(214),
  'local:perak:focus': getCategoryPostsEndpoint(261),
  'local:perak:special-column': getCategoryPostsEndpoint(265),
  'local:perak:dynamic': getCategoryPostsEndpoint(282),
  'local:perak:school': getCategoryPostsEndpoint(263),
  'local:perak:society': getCategoryPostsEndpoint(264),
  'local:perak:people': getCategoryPostsEndpoint(283),
  'supplement:topic': getCategoryPostsEndpoint(511),
  'supplement:lifestyle': getCategoryPostsEndpoint(533),
  'supplement:travel': getCategoryPostsEndpoint(548),
  'supplement:food': getCategoryPostsEndpoint(549),
  'supplement:column': getCategoryPostsEndpoint(559),
  'supplement:things': getCategoryPostsEndpoint(515),
  'supplement:fashion': getCategoryPostsEndpoint(516),
  'supplement:new-education': getCategoryPostsEndpoint(521),
  'supplement:e-trend': getCategoryPostsEndpoint(526),
  'supplement:arts': getCategoryPostsEndpoint(532),
  'supplement:life-protection': getCategoryPostsEndpoint(534),
  'supplement:car-viewing': getCategoryPostsEndpoint(535),
  'supplement:wellness': getCategoryPostsEndpoint(536),
  'supplement:family': getCategoryPostsEndpoint(539),
  'supplement:people': getCategoryPostsEndpoint(553),
  'supplement:audio-video': getCategoryPostsEndpoint(554),
  'supplement:readers': getCategoryPostsEndpoint(558),
  'supplement:flower-trace': getCategoryPostsEndpoint(126363),
  'supplement:creation': getCategoryPostsEndpoint(399186),
  'supplement:airasia-news': getCategoryPostsEndpoint(296178),
  'xuehai:power-teens': getCategoryPostsEndpoint(229737),
  'xuehai:study-record': getCategoryPostsEndpoint(310069),
  'xuehai:hou-lang-fang': getCategoryPostsEndpoint(310070)
}

const list = forgeController.query
  .description('Get latest news from Sin Chew')
  .input({
    query: z.object({
      type: z.enum(Object.keys(ENDPOINT) as Array<keyof typeof ENDPOINT>),
      page: z
        .string()
        .default('1')
        .transform(val => parseInt(val, 10)),
      range: z.enum(['6H', '24H', '1W']).default('6H')
    })
  })
  .callback(async ({ query: { page, type, range } }) => {
    const targetEndpoint = ENDPOINT[type]

    const query = new URLSearchParams(targetEndpoint.defaultQuery)

    if (page > 1) {
      query.set('page', page.toString())

      if (type === 'hot') {
        query.set('range', range)
      }
    }

    console.log(`${targetEndpoint.root}?${query.toString()}`)

    const response = await fetch(`${targetEndpoint.root}?${query.toString()}`)

    let data = await response.json()

    if (type === 'hot') {
      data =
        data[
          page === 1
            ? {
                '6H': 'zero',
                '24H': 'first',
                '1W': 'second'
              }[range]
            : 'result'
        ]
    }

    return (
      data.map((item: any) => ({
        id: item.ID,
        time_display: item.time_display || item.date_diff,
        category: item.cat || item.catlabel,
        title: item.title || item.post_title,
        excerpt: item.excerpt || item.post_excerpt,
        image: item.image
      })) as Array<{
        id: number
        time_display: string
        category: string
        title: string
        excerpt: string
        image: string
      }>
    ).filter(e => !['会员文', 'VIP文'].includes(e.category))
  })

export default forgeRouter({
  list
})
