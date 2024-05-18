/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React from 'react'
import Button from './Button'

function CreateOrModifyButton({
  type,
  loading,
  onClick,
  className
}: {
  type: 'create' | 'update' | 'rename' | null
  loading: boolean
  onClick: () => void
  className?: string
}): React.ReactElement {
  return (
    <Button
      disabled={loading}
      className={`mt-6 ${className}`}
      onClick={onClick}
      icon={
        !loading && type !== null
          ? {
              create: 'tabler:plus',
              update: 'tabler:pencil',
              rename: 'tabler:pencil'
            }[type]
          : 'svg-spinners:180-ring'
      }
    >
      {!loading &&
        type !== null &&
        {
          create: 'CREATE',
          update: 'UPDATE',
          rename: 'RENAME'
        }[type]}
    </Button>
  )
}

export default CreateOrModifyButton
