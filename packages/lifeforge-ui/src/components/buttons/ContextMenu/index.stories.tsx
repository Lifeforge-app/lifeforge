import { Icon } from '@iconify/react/dist/iconify.js'
import type { Meta, StoryObj } from '@storybook/react-vite'

import ContextMenuGroup from './components/ContextMenuGroup'
import ContextMenuItem from './components/ContextMenuItem'
import Index from './index'
import ContextMenu from './index'

const meta = {
  component: Index,
  argTypes: {
    children: {
      control: false
    }
  }
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <></>
  },
  render: () => (
    <div className="shadow-custom component-bg mx-64 h-full w-full rounded-lg p-4">
      <div className="flex-between">
        <div className="flex items-center gap-4">
          <div className="bg-custom-500/30 rounded-md p-2">
            <Icon className="text-custom-500 size-6" icon="tabler:cube" />
          </div>
          <h1 className="text-2xl font-medium">Something Cool</h1>
        </div>
        <ContextMenu>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() => {}}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() => {}}
          />
        </ContextMenu>
      </div>
      <p className="text-bg-500 mt-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </div>
  )
}

export const WithGroup: Story = {
  args: {
    children: (
      <>
        <ContextMenuGroup icon="tabler:eye" label="View">
          <ContextMenuItem icon="tabler:list" label="List" onClick={() => {}} />
          <ContextMenuItem
            checked
            icon="tabler:category-2"
            label="Grid"
            onClick={() => {}}
          />
        </ContextMenuGroup>
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => {}}
        />
      </>
    )
  }
}

export const CustomAnchor: Story = {
  args: {
    side: 'right',
    align: 'end',
    children: (
      <>
        <ContextMenuItem icon="tabler:pencil" label="Edit" onClick={() => {}} />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => {}}
        />
      </>
    )
  }
}

export const CustomIcon: Story = {
  args: {
    customIcon: 'tabler:upload',
    children: (
      <>
        <ContextMenuItem
          icon="tabler:file-text"
          label="Documents"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:photo"
          label="Pictures"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:video"
          label="Videos"
          onClick={() => {}}
        />
      </>
    )
  }
}
