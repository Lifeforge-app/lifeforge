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
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  title: string
  description: string
  icon: string
  ctaContent: string
}): React.ReactElement {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 text-neutral-100">
      <Icon icon={icon} className="h-32 w-32" />
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="-mt-2 text-xl text-neutral-500">{description}</p>
      <button
        onClick={() => {
          setModifyModalOpenType('create')
        }}
        className="mt-6 flex items-center gap-2 rounded-full bg-custom-500 p-4 px-6 pr-7 font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:bg-custom-600"
      >
        <Icon icon="tabler:plus" className="text-xl" />
        {ctaContent}
      </button>
    </div>
  )
}

export default EmptyStateScreen
