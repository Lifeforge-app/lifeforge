import type { Meta, StoryObj } from '@storybook/react'

import HamburgerMenu from '..'
import HamburgerSelectorWrapper from './HamburgerSelectorWrapper'
import MenuItem from './MenuItem'

const meta = {
  component: HamburgerSelectorWrapper
} satisfies Meta<typeof HamburgerSelectorWrapper>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'Categories',
    children: (
      <>
        <MenuItem icon="tabler:category" text="Item 1" onClick={() => {}} />
        <MenuItem icon="tabler:category" text="Item 2" onClick={() => {}} />
        <MenuItem icon="tabler:category" text="Item 3" onClick={() => {}} />
      </>
    )
  },
  render: props => (
    <HamburgerMenu classNames={{ menu: 'w-64' }}>
      <HamburgerSelectorWrapper {...props} />
    </HamburgerMenu>
  )
}

export const Togglable: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'Categories',
    children: (
      <>
        <MenuItem icon="tabler:category" text="Item 1" onClick={() => {}} />
        <MenuItem
          isToggled
          icon="tabler:category"
          text="Item 2"
          onClick={() => {}}
        />
        <MenuItem icon="tabler:category" text="Item 3" onClick={() => {}} />
      </>
    )
  },
  render: props => (
    <HamburgerMenu classNames={{ menu: 'w-64' }}>
      <HamburgerSelectorWrapper {...props} />
    </HamburgerMenu>
  )
}
