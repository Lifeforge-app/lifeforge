import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { TextInput } from '@components/inputs'
import { useModalStore } from '@components/overlays'

import QrCodeScanner from './QRCodeScanner'

const meta = {
  component: QrCodeScanner
} satisfies Meta<typeof QrCodeScanner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: {
      formats: ['qr_code'],
      onScanned: (data: string) => {
        alert(`Scanned data: ${data}`)
      }
    },
    onClose: () => {}
  },
  render: args => {
    const { open } = useModalStore()

    const handleOpenScanner = () => {
      open(QrCodeScanner, args.data)
    }

    return (
      <TextInput
        actionButtonProps={{
          icon: 'tabler:scan',
          onClick: handleOpenScanner
        }}
        icon="tabler:qrcode"
        label="QR Code Scanner"
        namespace=""
        placeholder="Click the scan button to open"
        value=""
        onChange={() => {}}
      />
    )
  }
}

export const BarcodeScanner: Story = {
  args: {
    data: {
      formats: ['linear_codes'],
      onScanned: (data: string) => {
        alert(`Scanned barcode data: ${data}`)
      }
    },
    onClose: () => {}
  },

  render: args => {
    const { open } = useModalStore()

    const handleOpenScanner = () => {
      open(QrCodeScanner, args.data)
    }

    return (
      <TextInput
        actionButtonProps={{
          icon: 'tabler:scan',
          onClick: handleOpenScanner
        }}
        icon="tabler:barcode"
        label="Barcode Scanner"
        namespace=""
        placeholder="Click the scan button to open"
        value=""
        onChange={() => {}}
      />
    )
  }
}

export const QRCodeScanner: Story = {
  args: {
    data: {
      formats: ['qr_code'],
      onScanned: () => {}
    },
    onClose: () => {}
  },
  render: args => {
    const { open } = useModalStore()

    const [value, setValue] = useState('')

    return (
      <TextInput
        actionButtonProps={{
          icon: 'tabler:qrcode',
          onClick: () => {
            open(QrCodeScanner, {
              ...args.data,
              onScanned: (data: string) => {
                setValue(data)
                args.data.onScanned(data)
              }
            })
          }
        }}
        icon="tabler:file-text"
        label="Scanned QR Code Content"
        namespace=""
        placeholder="Scan a QR code..."
        value={value}
        onChange={setValue}
      />
    )
  }
}
