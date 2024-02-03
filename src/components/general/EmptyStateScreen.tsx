/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function EmptyStateScreen({
  setModifyModalOpenType,
  title,
  description,
  icon,
  ctaContent
}: {
  setModifyModalOpenType?: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  title: string
  description: string
  icon: string
  ctaContent?: string
}): React.ReactElement {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 ">
      <Icon icon={icon} className="h-32 w-32" />
      <h2 className="text-center text-3xl font-semibold">{title}</h2>
      <p className="-mt-2 text-center text-lg text-bg-500 sm:text-xl">
        {description}
      </p>
      {ctaContent && setModifyModalOpenType && (
        <button
          onClick={() => {
            setModifyModalOpenType('create')
          }}
          className="mt-6 flex items-center gap-2 rounded-full bg-custom-500 p-4 px-6 pr-7 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-custom-600 dark:text-bg-800"
        >
          <Icon icon="tabler:plus" className="text-xl" />
          {ctaContent}
        </button>
      )}
    </div>
  )
}

export default EmptyStateScreen
