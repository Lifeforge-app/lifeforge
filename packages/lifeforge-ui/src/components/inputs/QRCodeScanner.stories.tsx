import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@components/inputs'
import { useModalStore } from '@components/overlays'

import QrCodeScanner from './QRCodeScanner'

const meta = {
  component: QrCodeScanner
} satisfies Meta<typeof QrCodeScanner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClose: () => {},
    data: {
      formats: ['qr_code'],
      onScanned: (data: string) => {
        alert(`Scanned data: ${data}`)
      }
    }
  },
  render: args => {
    const open = useModalStore(state => state.open)

    const handleOpenScanner = () => {
      open(QrCodeScanner, args.data)
    }

    return (
      <Button icon="tabler:qrcode" onClick={handleOpenScanner}>
        Open QR Code Scanner
      </Button>
    )
  }
}

export const BarcodeScanner: Story = {
  args: {
    onClose: () => {},
    data: {
      formats: ['linear_codes'],
      onScanned: (data: string) => {
        alert(`Scanned barcode data: ${data}`)
      }
    }
  },

  render: args => {
    const open = useModalStore(state => state.open)

    const handleOpenScanner = () => {
      open(QrCodeScanner, args.data)
    }

    return (
      <Button icon="tabler:barcode" onClick={handleOpenScanner}>
        Open Barcode Scanner
      </Button>
    )
  }
}
