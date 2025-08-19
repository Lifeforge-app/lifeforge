import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ModalHeader, WithQuery } from 'lifeforge-ui'

function ContentModal({
  onClose,
  data: { url }
}: {
  onClose: () => void
  data: {
    url: string
  }
}) {
  const contentQuery = useQuery(
    forgeAPI.sinChewDaily.getContent
      .input({
        url
      })
      .queryOptions()
  )

  return (
    <div className="min-w-[60vw]">
      <ModalHeader icon="tabler:news" title="View Article" onClose={onClose} />
      <WithQuery query={contentQuery}>
        {content => (
          <>
            <h1 className="mb-2 text-3xl font-semibold">{content.title}</h1>
            <div className="text-bg-500 mb-8">{content.time}</div>
            <div
              className="news-article"
              dangerouslySetInnerHTML={{
                __html: content.content
              }}
            />
          </>
        )}
      </WithQuery>
    </div>
  )
}

export default ContentModal
