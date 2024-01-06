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
      <Icon icon={icon} className="h-24 w-24" />
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="-mt-2 text-xl">{description}</p>
      <button
        onClick={() => {
          setModifyModalOpenType('create')
        }}
        className="mt-6 flex items-center gap-2 rounded-full bg-teal-500 p-4 px-6 pr-7 font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:bg-teal-600"
      >
        <Icon icon="tabler:plus" className="text-xl" />
        {ctaContent}
      </button>
    </div>
  )
}

export default EmptyStateScreen
