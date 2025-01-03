import React, { memo } from 'react'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'

function EntryContent({ entry }: { entry: IIdeaBoxEntry }): React.ReactElement {
  const { componentBgLighterWithHover } = useThemeColors()
  const [data] = useFetch<Record<string, any>>(
    `idea-box/og-data/${entry.id}`,
    true,
    'GET',
    undefined,
    true,
    false
  )

  return typeof data !== 'string' ? (
    <div
      onClick={() => {
        const a = document.createElement('a')
        a.href = entry.content
        a.target = '_blank'
        a.rel = 'noreferrer noopener'
        a.click()
      }}
      className={`w-full cursor-pointer space-y-2 rounded-md p-2 ${componentBgLighterWithHover}`}
    >
      {data.ogImage !== undefined && (
        <img
          src={(() => {
            const url: string = data.ogImage?.[0].url

            if (!url.startsWith('http')) {
              return `${new URL(entry.content).origin}${
                !url.startsWith('/') ? '/' : ''
              }${url}`
            }

            return url
          })()}
          alt=""
          className="w-full rounded-md border-0 object-contain"
        />
      )}
      <p className="text-xs font-medium text-custom-500">
        {data.ogSiteName ?? new URL(entry.content).hostname}
      </p>
      {data.ogTitle !== undefined && (
        <p className="text-sm font-medium">{data.ogTitle}</p>
      )}
      {data.ogDescription !== undefined && (
        <p className="mt-2 break-words text-xs text-bg-500">
          {data.ogDescription}
        </p>
      )}
    </div>
  ) : (
    <a
      target="_blank"
      rel="noreferrer"
      href={entry.content}
      className="break-all text-custom-500 underline underline-offset-2"
    >
      {entry.content}
    </a>
  )
}

export default memo(EntryContent)
