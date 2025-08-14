import { Icon } from '@iconify/react/dist/iconify.js'
import { useModalStore } from 'lifeforge-ui'

import type { NewsArticle } from '..'
import ContentModal from './ContentModal'

function ArticleItem({ item }: { item: NewsArticle }) {
  const open = useModalStore(state => state.open)

  return (
    <article className="shadow-custom component-bg-with-hover relative flex flex-col items-center gap-6 rounded-xl p-4 md:flex-row">
      <div className="component-bg-lighter relative aspect-video w-full shrink-0 overflow-hidden rounded-lg md:w-96">
        <Icon
          className="text-bg-300 dark:text-bg-700 absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 transform"
          icon="tabler:news"
        />
        {item.image && (
          <img
            alt=""
            className="relative h-full w-full object-cover"
            referrerPolicy="no-referrer"
            src={item.image}
          />
        )}
      </div>
      <div className="w-full">
        <p className="text-custom-500 mb-2 text-lg font-semibold">
          {item.category}
        </p>
        <h3 className="text-2xl font-semibold">{item.title}</h3>
        <p className="text-bg-600 dark:text-bg-400 mt-4 line-clamp-3">
          {item.excerpt}
        </p>
        <p className="text-bg-500 mt-4">{item.time_display}</p>
      </div>
      <button
        className="absolute inset-0 rounded-xl"
        onClick={() => {
          open(ContentModal, {
            url: item.link
          })
        }}
      />
    </article>
  )
}

export default ArticleItem
