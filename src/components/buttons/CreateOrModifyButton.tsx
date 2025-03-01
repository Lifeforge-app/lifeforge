import clsx from 'clsx'
import React from 'react'
import Button from './Button'

function CreateOrModifyButton({
  type,
  loading,
  onClick,
  disabled,
  className
}: {
  type: 'create' | 'update' | 'rename' | null
  loading: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
}): React.ReactElement {
  return (
    <Button
      className={clsx('mt-6', className)}
      disabled={disabled}
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
