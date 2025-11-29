import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button, Listbox, ListboxOption } from '@components/inputs'

import Widget from './Widget'

const meta = {
  component: Widget
} satisfies Meta<typeof Widget>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Displaying multiple Widget components in a grid layout.
 */
export const Default: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'Cool Widget'
  },
  render: args => (
    <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-6 p-16">
      <Widget {...args}>
        <p className="text-bg-600 dark:text-bg-400">
          This is a dashboard item.
        </p>
      </Widget>
      <Widget {...args} className="col-span-2 row-span-2">
        <p className="text-bg-600 dark:text-bg-400">
          This is a larger dashboard item.
        </p>
      </Widget>
      <Widget {...args} className="row-span-2">
        <p className="text-bg-600 dark:text-bg-400">
          This is a tall dashboard item.
        </p>
      </Widget>
      <Widget {...args} className="col-span-2">
        <p className="text-bg-600 dark:text-bg-400">
          This is a wide dashboard item.
        </p>
      </Widget>
    </div>
  )
}

export const WithActionComponent: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'A Cool Widget',
    actionComponent: (
      <Button className="p-2!" icon="tabler:plus" variant="plain" />
    )
  },
  render: args => (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-6 p-16">
      <Widget {...args}>
        <p className="text-bg-600 dark:text-bg-400">
          This widget has a plus button beside the title. When clicked, maybe a
          modal appears?
        </p>
      </Widget>
      <Widget
        actionComponent={
          <Button
            className="p-2!"
            icon="tabler:chevron-right"
            variant="plain"
          />
        }
        icon="tabler:cube"
        title="Another Cool Widget"
      >
        <p className="text-bg-600 dark:text-bg-400">
          This widget has an action button that can be clicked to navigate to
          view more details.
        </p>
      </Widget>
      <Widget
        actionComponent={
          <Listbox
            buttonContent={<>Last 7 Days</>}
            className="max-w-56"
            value="last_7_days"
            onChange={() => {}}
          >
            <ListboxOption label="Last 24 Hours" value="last_24_hours" />
            <ListboxOption label="Last 7 Days" value="last_7_days" />
            <ListboxOption label="Last 30 Days" value="last_30_days" />
            <ListboxOption label="Last 90 Days" value="last_90_days" />
          </Listbox>
        }
        className="col-span-2"
        icon="tabler:cube"
        title="Widget with Listbox"
      >
        <p className="text-bg-600 dark:text-bg-400">
          This widget has a listbox beside the title for filtering the displayed
          data. Especially useful for time range filters for statistics chart
          etc.
        </p>
      </Widget>
    </div>
  )
}
