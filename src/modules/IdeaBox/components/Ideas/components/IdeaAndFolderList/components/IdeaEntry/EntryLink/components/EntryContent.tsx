import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { memo } from 'react'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

import { type IIdeaBoxEntry } from '../../../../../../../../interfaces/ideabox_interfaces'

function EntryContent({ entry }: { entry: IIdeaBoxEntry }): React.ReactElement {
  const { componentBgLighterWithHover } = useComponentBg()
  const OGQuery = useQuery<Record<string, any>>({
    queryKey: ['idea-box', 'og', entry.id],
    queryFn: () =>
      fetchAPI(`idea-box/og-data/${entry.id}`, {
        raiseError: false
      }),
    retry: 5
  })

  return OGQuery.isSuccess && OGQuery.data !== undefined ? (
    <button
      className={clsx(
        'w-full cursor-pointer space-y-2 rounded-md p-2 text-left',
        componentBgLighterWithHover
      )}
      onClick={() => {
        const a = document.createElement('a')
        a.href = entry.content
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
              return `${new URL(entry.content).origin}${
                !url.startsWith('/') ? '/' : ''
              }${url}`
            }

            return url
          })()}
        />
      )}
      <p className="text-custom-500 text-xs font-medium">
        {OGQuery.data.ogSiteName ?? new URL(entry.content).hostname}
      </p>
      {OGQuery.data.ogTitle !== undefined && (
        <p className="text-sm font-medium">{OGQuery.data.ogTitle}</p>
      )}
      {OGQuery.data.ogDescription !== undefined && (
        <p className="text-bg-500 mt-2 break-words text-xs">
          {OGQuery.data.ogDescription}
        </p>
      )}
    </button>
  ) : (
    <a
      className="text-custom-500 break-all underline underline-offset-2"
      href={entry.content}
      rel="noreferrer"
      target="_blank"
    >
      {entry.content}
    </a>
  )
}

export default memo(EntryContent)
