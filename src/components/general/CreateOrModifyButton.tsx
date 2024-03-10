/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useContext } from 'react'
import { PersonalizationContext } from '../../providers/PersonalizationProvider'

function CreateOrModifyButton({
  type,
  loading,
  onClick
}: {
  type: 'create' | 'update' | 'rename' | null
  loading: boolean
  onClick: () => void
}): React.ReactElement {
  const { theme } = useContext(PersonalizationContext)

  return (
    <button
      disabled={loading}
      className="mt-6 flex h-16 items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-custom-600 dark:text-bg-800"
      onClick={onClick}
    >
      {!loading && type !== null ? (
        <>
          <Icon
            icon={
              {
                create: 'tabler:plus',
                update: 'tabler:pencil',
                rename: 'tabler:pencil'
              }[type]
            }
            className="h-5 w-5"
          />
          {
            {
              create: 'CREATE',
              update: 'UPDATE',
              rename: 'RENAME'
            }[type]
          }
        </>
      ) : (
        <span
          className={
            (theme === 'system' &&
              window.matchMedia &&
              window.matchMedia('(prefers-color-scheme: dark)').matches) ||
            theme === 'dark'
              ? 'small-loader-dark'
              : 'small-loader-light'
          }
        ></span>
      )}
    </button>
  )
}

export default CreateOrModifyButton
