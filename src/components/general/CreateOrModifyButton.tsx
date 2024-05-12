/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import React from 'react'
import Button from './Button'

function CreateOrModifyButton({
  type,
  loading,
  onClick
}: {
  type: 'create' | 'update' | 'rename' | null
  loading: boolean
  onClick: () => void
}): React.ReactElement {
  return (
    <Button
      disabled={loading}
      className="mt-6"
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
