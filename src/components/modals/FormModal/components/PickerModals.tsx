import React from 'react'
import {
  ColorPickerModal,
  IconPickerModal,
  ImagePickerModal
} from '@components/inputs'
import QRCodeScanner from '@components/inputs/QRCodeScanner'
import { IFieldProps } from '@interfaces/modal_interfaces'

function PickerModals<T extends Record<string, any | any[]>>({
  fields,
  data,
  setData,
  colorPickerOpen,
  setColorPickerOpen,
  iconSelectorOpen,
  setIconSelectorOpen,
  imagePickerModalOpen,
  setImagePickerModalOpen,
  qrScannerModalOpen,
  setQRScannerModalOpen
}: {
  fields: IFieldProps<T>[]
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
  colorPickerOpen: string | null
  setColorPickerOpen: (id: string | null) => void
  iconSelectorOpen: string | null
  setIconSelectorOpen: (id: string | null) => void
  imagePickerModalOpen: string | null
  setImagePickerModalOpen: (id: string | null) => void
  qrScannerModalOpen: string | null
  setQRScannerModalOpen: (id: string | null) => void
}): React.ReactElement {
  return (
    <>
      {fields.some(f => f.type === 'color') && (
        <ColorPickerModal
          color={(data[colorPickerOpen ?? ''] as string) ?? '#FFFFFF'}
          isOpen={colorPickerOpen !== null}
          setColor={value => {
            setData(prev => ({
              ...prev,
              [colorPickerOpen ?? '']: value
            }))
          }}
          setOpen={() => {
            setColorPickerOpen(null)
          }}
        />
      )}
      {fields.some(f => f.type === 'icon') && (
        <IconPickerModal
          isOpen={iconSelectorOpen !== null}
          setOpen={() => {
            setIconSelectorOpen(null)
          }}
          setSelectedIcon={value => {
            setData(prev => ({
              ...prev,
              [iconSelectorOpen ?? '']: value
            }))
          }}
        />
      )}
      {fields.some(f => f.type === 'file') && (
        <ImagePickerModal
          enablePixaBay
          enableUrl
          acceptedMimeTypes={{
            images: ['image/png', 'image/jpeg', 'image/webp']
          }}
          isOpen={imagePickerModalOpen !== null}
          onClose={() => {
            setImagePickerModalOpen(null)
          }}
          onSelect={async (file, preview) => {
            setData(prev => ({
              ...prev,
              [imagePickerModalOpen ?? '']: {
                image: file,
                preview
              }
            }))
          }}
        />
      )}
      {fields.some(f => Object.keys(f).includes('qrScanner')) && (
        <QRCodeScanner
          isOpen={qrScannerModalOpen !== null}
          onClose={() => {
            setQRScannerModalOpen(null)
          }}
          onScanned={data => {
            setData(prev => ({
              ...prev,
              [qrScannerModalOpen ?? '']: data
            }))
          }}
        />
      )}
    </>
  )
}

export default PickerModals
