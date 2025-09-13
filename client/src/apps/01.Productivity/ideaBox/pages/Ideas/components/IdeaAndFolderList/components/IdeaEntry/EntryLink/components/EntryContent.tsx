import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { memo } from 'react'

import type { IdeaBoxIdea } from '@apps/01.Productivity/ideaBox/providers/IdeaBoxProvider'

function EntryContent({ entry }: { entry: IdeaBoxIdea }) {
  const OGQuery = useQuery(
    forgeAPI.ideaBox.misc.getOgData.input({ id: entry.id }).queryOptions({
      retry: 5
    })
  )

  if (entry.type !== 'link') {
    return null
  }

  return OGQuery.isSuccess && OGQuery.data ? (
    <button
      className="shadow-custom component-bg-lighter-with-hover w-full cursor-pointer space-y-2 rounded-md p-2 text-left"
      onClick={() => {
        const a = document.createElement('a')

        a.href = entry.link
        a.target = '_blank'
        a.rel = 'noreferrer noopener'
        a.click()
      }}
    >
      {OGQuery.data.ogImage !== undefined && (
        <img
          alt=""
          className="w-full rounded-md border-0 object-contain"
          src={(() => {
            const url: string = OGQuery.data.ogImage?.[0].url

            if (!url.startsWith('http')) {
              return `${new URL(entry.link).origin}${
                !url.startsWith ? '/' : ''
              }${url}`
            }

            return url
          })()}
        />
      )}
      <p className="text-custom-500 text-xs font-medium">
        {OGQuery.data.ogSiteName ?? new URL(entry.link).hostname}
      </p>
      {OGQuery.data.ogTitle !== undefined && (
        <p className="text-sm font-medium">{OGQuery.data.ogTitle}</p>
      )}
      {OGQuery.data.ogDescription !== undefined && (
        <p className="text-bg-500 mt-2 text-xs break-words">
          {OGQuery.data.ogDescription}
        </p>
      )}
    </button>
  ) : (
    <a
      className="text-custom-500 break-all underline underline-offset-2"
      href={entry.link}
      rel="noreferrer"
      target="_blank"
    >
      {entry.link}
    </a>
  )
}

export default memo(EntryContent)
