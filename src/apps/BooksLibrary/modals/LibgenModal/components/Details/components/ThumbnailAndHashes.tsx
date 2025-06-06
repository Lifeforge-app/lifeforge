import { Icon } from '@iconify/react'

import { BookDetailProps } from '..'

function ThumbnailAndHashes({ data }: { data: BookDetailProps }) {
  return (
    <aside className="flex-center top-0 h-full flex-col md:sticky">
      {data.image !== '../img/blank.png' ? (
        <img
          alt=""
          className="size-full max-w-64 object-contain"
          referrerPolicy="no-referrer"
          src={`${import.meta.env.VITE_API_HOST}/books-library/libgen${data.image.replace(
            /^\/covers\//,
            '/cover/'
          )}`}
        />
      ) : (
        <Icon
          className="text-bg-400 dark:text-bg-600 h-full w-64"
          icon="iconamoon:file-document-light"
        />
      )}
      <h2 className="mt-4 mb-2 hidden w-full text-left font-medium md:block">
        Hashes
      </h2>
      <div className="hidden w-full flex-col gap-2 text-xs md:flex">
        {Object.entries(data.hashes).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-bg-400 dark:text-bg-400 mb-0.5">{key}</span>
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
