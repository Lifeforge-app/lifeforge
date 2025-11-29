import { Icon } from '@iconify/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import Listbox from './Listbox'
import ListboxOption from './ListboxInput/components/ListboxOption'

const meta = {
  component: Listbox,
  argTypes: {
    value: {
      control: false
    },
    onChange: {
      control: false
    },
    buttonContent: {
      control: false
    },
    children: {
      control: false
    }
  }
} satisfies Meta<typeof Listbox>

export default meta

type Story = StoryObj<typeof meta>

const OPTIONS = [
  {
    value: 'low',
    label: 'Low Priority',
    icon: 'tabler:flag',
    color: colors.green[500]
  },
  {
    value: 'medium',
    label: 'Medium Priority',
    icon: 'tabler:flag',
    color: colors.yellow[500]
  },
  {
    value: 'high',
    label: 'High Priority',
    icon: 'tabler:flag',
    color: colors.red[500]
  }
]

/**
 * A simple listbox component for selecting from a list of options.
 */
export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    buttonContent: <></>,
    children: <></>
  },
  render: args => {
    const [value, onChange] = useState('low')

    const selectedOption = OPTIONS.find(o => o.value === value)

    return (
      <div className="w-96">
        <Listbox
          {...args}
          buttonContent={
            <span className="flex items-center gap-2">
              <Icon
                className="size-5"
                color={selectedOption?.color || colors.gray[500]}
                icon={selectedOption?.icon || 'tabler:cube'}
              />
              {selectedOption?.label || 'Select an option'}
            </span>
          }
          value={value}
          onChange={onChange}
        >
          {OPTIONS.map(({ value, label, icon, color }) => (
            <ListboxOption
              key={value}
              color={color}
              icon={icon}
              label={label}
              value={value}
            />
          ))}
        </Listbox>
      </div>
    )
  }
}

/**
 * A listbox with multiple options selected.
 */
export const MultipleOptions: Story = {
  args: {
    value: [],
    onChange: () => {},
    buttonContent: <></>,
    children: <></>
  },
  render: args => {
    const [value, onChange] = useState([OPTIONS[2].value]) // Initialize with an array of values

    return (
      <div className="w-96">
        <Listbox
          {...args}
          buttonContent={
            <span className="flex flex-wrap items-center gap-2">
              {(value as string[]).length > 0
                ? (value as string[]).map((v, index) => {
                    const option = OPTIONS.find(o => o.value === v)

                    return (
                      <>
                        <span key={index} className="flex items-center gap-2">
                          <Icon
                            className="size-5 shrink-0"
                            color={option?.color || colors.gray[500]}
                            icon={option?.icon || 'tabler:cube'}
                          />
                          <span className="whitespace-nowrap">
                            {option?.label}
                          </span>
                        </span>
                        {index !== (value as string[]).length - 1 && (
                          <Icon
                            className="text-bg-400 dark:text-bg-600 size-1.5"
                            icon="tabler:circle-filled"
                          />
                        )}
                      </>
                    )
                  })
                : 'Select options'}
            </span>
          }
          value={value}
          onChange={onChange}
        >
          {OPTIONS.map(({ value, label, icon, color }) => (
            <ListboxOption
              key={value}
              color={color}
              icon={icon}
              label={label}
              value={value}
            />
          ))}
        </Listbox>
      </div>
    )
  }
}
