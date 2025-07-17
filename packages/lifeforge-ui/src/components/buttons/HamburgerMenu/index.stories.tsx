import type { Meta, StoryObj } from '@storybook/react'

import MenuItem from './components/MenuItem'
import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <MenuItem icon="tabler:pencil" text="Edit" onClick={() => {}} />
        <MenuItem isRed icon="tabler:trash" text="Delete" onClick={() => {}} />
      </>
    )
  }
}

export const CustomAnchor: Story = {
  args: {
    children: (
      <>
        <MenuItem icon="tabler:pencil" text="Edit" onClick={() => {}} />
        <MenuItem isRed icon="tabler:trash" text="Delete" onClick={() => {}} />
      </>
    ),
    anchor: 'right start'
  }
}

export const CustomIcon: Story = {
  args: {
    customIcon: 'tabler:upload',
    children: (
      <>
        <MenuItem icon="tabler:file-text" text="Documents" onClick={() => {}} />
        <MenuItem icon="tabler:photo" text="Pictures" onClick={() => {}} />
        <MenuItem icon="tabler:video" text="Videos" onClick={() => {}} />
      </>
    )
  }
}
