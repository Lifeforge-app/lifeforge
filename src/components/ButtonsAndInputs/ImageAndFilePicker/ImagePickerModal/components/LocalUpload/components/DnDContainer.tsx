import { Icon } from '@iconify/react/dist/iconify.js'
import { t } from 'i18next'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'

function DnDContainer({
  getRootProps,
  getInputProps,
  isDragActive
}: {
  getRootProps: any
  getInputProps: any
  isDragActive: boolean
}): React.ReactElement {
  return (
    <div
      className="flex-center flex size-full min-h-96 flex-1 flex-col rounded-lg border-[3px] border-dashed border-bg-500 py-12"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Icon icon="tabler:drag-drop" className="size-20 text-bg-500" />
      <div className="mt-4 text-center text-2xl font-medium text-bg-500">
        {isDragActive ? t('dnd.dropHere') : t('dnd.dragAndDropToUpload')}
      </div>
      <div className="mt-4 text-center text-lg font-semibold uppercase tracking-widest text-bg-500">
        {t('auth.or')}
      </div>
      <Button
        CustomElement="label"
        icon="tabler:upload"
        className="mt-4 cursor-pointer"
        variant="secondary"
      >
        upload from local
      </Button>
    </div>
  )
}

export default DnDContainer
