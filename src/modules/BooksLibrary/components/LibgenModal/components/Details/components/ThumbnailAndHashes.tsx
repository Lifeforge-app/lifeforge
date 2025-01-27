import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { BookDetailProps } from '..'

function ThumbnailAndHashes({
  data
}: {
  data: BookDetailProps
}): React.ReactElement {
  return (
    <aside className="flex-center top-0 h-full flex-col md:sticky">
      {data.image !== '../img/blank.png' ? (
        <img
          src={`${import.meta.env.VITE_API_HOST}/books-library/libgen${
            data.image
          }`}
          className="size-full max-w-64 object-contain"
          referrerPolicy="no-referrer"
          alt=""
        />
      ) : (
        <Icon
          icon="iconamoon:file-document-light"
          className="h-full w-64 text-bg-400 dark:text-bg-600"
        />
      )}
      <h2 className="mb-2 mt-4 hidden w-full text-left font-medium md:block">
        Hashes
      </h2>
      <div className="hidden w-full flex-col gap-2 text-xs md:flex">
        {Object.entries(data.hashes).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="mb-0.5 text-bg-400 dark:text-bg-400">{key}</span>
            {value.split(' ').map((hash, i) => (
              <span key={i} className="font-['JetBrains_Mono']">
                {hash}
              </span>
            ))}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default ThumbnailAndHashes