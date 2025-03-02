import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { memo } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import APIRequestV2 from '@utils/newFetchData'

function EntryContent({ entry }: { entry: IIdeaBoxEntry }): React.ReactElement {
  const { componentBgLighterWithHover } = useThemeColors()
  const OGQuery = useQuery<Record<string, any>>({
    queryKey: ['idea-box', 'og', entry.id],
    queryFn: () =>
      APIRequestV2(`idea-box/og-data/${entry.id}`, {
        raiseError: false
      }),
    retry: 5
  })

  return OGQuery.isSuccess && OGQuery.data !== undefined ? (
    <button
      className={clsx(
        'w-full text-left cursor-pointer space-y-2 rounded-md p-2',
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
      <p className="text-xs font-medium text-custom-500">
        {OGQuery.data.ogSiteName ?? new URL(entry.content).hostname}
      </p>
      {OGQuery.data.ogTitle !== undefined && (
        <p className="text-sm font-medium">{OGQuery.data.ogTitle}</p>
      )}
      {OGQuery.data.ogDescription !== undefined && (
        <p className="mt-2 break-words text-xs text-bg-500">
          {OGQuery.data.ogDescription}
        </p>
      )}
    </button>
  ) : (
    <a
      className="break-all text-custom-500 underline underline-offset-2"
      href={entry.content}
      rel="noreferrer"
      target="_blank"
    >
      {entry.content}
    </a>
  )
}

export default memo(EntryContent)
