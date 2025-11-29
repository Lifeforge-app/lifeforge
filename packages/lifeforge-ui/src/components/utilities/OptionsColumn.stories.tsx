import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { SliderInput, Switch } from '@components/controls'

import OptionsColumn from './OptionsColumn'
import Tooltip from './Tooltip'

const meta = {
  component: OptionsColumn,
  argTypes: {
    children: {
      control: false
    },
    tooltip: {
      control: false
    }
  }
} satisfies Meta<typeof OptionsColumn>

export default meta

type Story = StoryObj<typeof meta>

/**
 * An options column with a switch control.
 */
export const Default: Story = {
  args: {
    title: 'Enable Notifications',
    description: 'Receive notifications for important updates',
    icon: 'tabler:bell',
    children: <></>
  },
  render: args => {
    const [enabled, setEnabled] = useState(false)

    return (
      <div className="w-[60vw]">
        <OptionsColumn {...args}>
          <Switch value={enabled} onChange={setEnabled} />
        </OptionsColumn>
      </div>
    )
  }
}

/**
 * An options column with a tooltip.
 */
export const WithTooltip: Story = {
  args: {
    title: 'Auto Save',
    description: 'Automatically save changes as you work',
    icon: 'tabler:device-floppy',
    tooltip: 'This feature will save your work every 5 minutes.',
    children: <></>
  },
  render: args => {
    const [enabled, setEnabled] = useState(true)

    return (
      <div className="w-[60vw]">
        <OptionsColumn {...args}>
          <Switch value={enabled} onChange={setEnabled} />
        </OptionsColumn>
      </div>
    )
  }
}

/**
 * A vertical options column.
 */
export const Vertical: Story = {
  args: {
    title: 'Theme Settings',
    description: 'Customize the appearance of your workspace',
    icon: 'tabler:palette',
    orientation: 'vertical',
    children: <></>
  },
  render: args => {
    return (
      <div className="w-[60vw]">
        <OptionsColumn {...args}>
          <SliderInput
            label="Brightness"
            max={100}
            min={0}
            value={70}
            onChange={() => {}}
          />
        </OptionsColumn>
      </div>
    )
  }
}

/**
 * Multiple options columns in a list.
 */
export const MultipleColumns: Story = {
  args: {
    title: '',
    description: '',
    icon: '',
    children: <></>
  },
  render: () => {
    const [notifications, setNotifications] = useState(true)

    const [autoSave, setAutoSave] = useState(false)

    const [darkMode, setDarkMode] = useState(true)

    return (
      <div className="w-[60vw] space-y-3">
        <OptionsColumn
          description="Receive notifications for important updates"
          icon="tabler:bell"
          title="Enable Notifications"
        >
          <Switch value={notifications} onChange={setNotifications} />
        </OptionsColumn>
        <OptionsColumn
          description="Automatically save changes as you work"
          icon="tabler:device-floppy"
          title="Auto Save"
        >
          <Switch value={autoSave} onChange={setAutoSave} />
        </OptionsColumn>
        <OptionsColumn
          description="Use dark theme for better viewing at night"
          icon="tabler:moon"
          title="Dark Mode"
        >
          <Switch value={darkMode} onChange={setDarkMode} />
        </OptionsColumn>
      </div>
    )
  }
}

/**
 * An options column indicating a feature is not available.
 */
export const NAColumn: Story = {
  args: {
    title: 'Data Sync',
    description: 'Sync your data across all devices',
    icon: 'tabler:cloud-data-connection',
    children: <></>
  },
  render: args => {
    return (
      <div className="w-[60vw]">
        <OptionsColumn {...args}>
          <span className="text-bg-500">N/A</span>
          <Tooltip icon="tabler:info-circle" id="data-sync-na">
            Google Cloud API key (<code>gcloud</code>) is required for this
            feature, but it is not found in your API key vault. <br />
            Please add it to enable data sync.
          </Tooltip>
        </OptionsColumn>
      </div>
    )
  }
}
