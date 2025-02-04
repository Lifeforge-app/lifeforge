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
      className={`mt-6 ${className}`}
      icon={
        !loading && type !== null
          ? {
              create: 'tabler:plus',
              update: 'tabler:pencil',
              rename: 'tabler:pencil'
            }[type]
          : 'svg-spinners:180-ring'
      }
      loading={loading}
      onClick={onClick}
    >
      {!loading && type !== null && type}
    </Button>
  )
}

export default CreateOrModifyButton
