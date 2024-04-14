import { Icon } from '@iconify/react'
import React from 'react'

function Error({ message }: { message: string }): React.ReactElement {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <Icon icon="tabler:alert-triangle" className="h-12 w-12 text-red-500" />
      <p className="text-lg font-medium text-red-500">{message}</p>
    </div>
  )
}

export default Error
