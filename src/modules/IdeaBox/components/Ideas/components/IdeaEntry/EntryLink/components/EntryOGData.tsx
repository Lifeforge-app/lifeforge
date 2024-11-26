import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

function EntryOGData({
  data,
  href
}: {
  data: Record<string, any>
  href: string
}): React.ReactElement {
  const { componentBgLighterWithHover } = useThemeColors()

  return (
    <div
      onClick={() => {
        const a = document.createElement('a')
        a.href = href
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
              return `${new URL(href).origin}${
                !url.startsWith('/') ? '/' : ''
              }${url}`
            }

            return url
          })()}
          alt=""
          className="h-24 w-full rounded-md border-0 object-cover"
        />
      )}
      <p className="text-xs font-medium text-custom-500">
        {data.ogSiteName ?? new URL(href).hostname}
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
  )
}

export default EntryOGData
