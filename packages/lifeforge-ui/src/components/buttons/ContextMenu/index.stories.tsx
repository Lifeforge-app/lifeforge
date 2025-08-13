import type { Meta, StoryObj } from '@storybook/react'

import ContextMenuItem from './components/ContextMenuItem'
import ContextMenuSelectorWrapper from './components/ContextMenuSelectorWrapper'
import ContextMenuSeparator from './components/ContextMenuSeparator'
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
        <ContextMenuItem icon="tabler:pencil" text="Edit" onClick={() => {}} />
        <ContextMenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {}}
        />
      </>
    )
  }
}

export const WithSeparator: Story = {
  args: {
    children: (
      <>
        <ContextMenuItem icon="tabler:pencil" text="Edit" onClick={() => {}} />
        <ContextMenuItem
          icon="tabler:copy"
          text="Duplicate"
          onClick={() => {}}
        />
        <ContextMenuSeparator />
        <ContextMenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {}}
        />
      </>
    )
  }
}

export const WithGroupWrapper: Story = {
  args: {
    children: (
      <>
        <ContextMenuSelectorWrapper icon="tabler:settings" title="Actions">
          <ContextMenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={() => {}}
          />
          <ContextMenuItem
            icon="tabler:copy"
            text="Duplicate"
            onClick={() => {}}
          />
        </ContextMenuSelectorWrapper>
        <ContextMenuSeparator />
        <ContextMenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {}}
        />
      </>
    )
  }
}

export const CustomAnchor: Story = {
  args: {
    children: (
      <>
        <ContextMenuItem icon="tabler:pencil" text="Edit" onClick={() => {}} />
        <ContextMenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {}}
        />
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
        <ContextMenuItem
          icon="tabler:file-text"
          text="Documents"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:photo"
          text="Pictures"
          onClick={() => {}}
        />
        <ContextMenuItem icon="tabler:video" text="Videos" onClick={() => {}} />
      </>
    )
  }
}
