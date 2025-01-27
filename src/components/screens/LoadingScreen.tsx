import React from 'react'

export default function LoadingScreen({
  customMessage
}: {
  customMessage?: string
}): React.ReactElement {
  return (
    <div className="flex-center size-full flex-col gap-6">
      <span className="loader"></span>
      <p className="text-lg font-medium text-bg-500">{customMessage ?? ''}</p>
    </div>
  )
}
