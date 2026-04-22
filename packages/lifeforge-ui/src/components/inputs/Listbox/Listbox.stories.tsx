import { Icon } from '@iconify/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import { Box, Flex, Text } from '@components/primitives'

import ListboxOption from '../ListboxInput/components/ListboxOption'
import Listbox from './Listbox'

const meta = {
  argTypes: {
    children: {
      control: false
    },
    onChange: {
      control: false
    },
    renderContent: {
      control: false
    },
    value: {
      control: false
    }
  },
  component: Listbox
} satisfies Meta<typeof Listbox>

export default meta

type Story = StoryObj<typeof meta>

const OPTIONS = [
  {
    color: colors.green[500],
    icon: 'tabler:flag',
    label: 'Low Priority',
    value: 'low'
  },
  {
    color: colors.yellow[500],
    icon: 'tabler:flag',
    label: 'Medium Priority',
    value: 'medium'
  },
  {
    color: colors.red[500],
    icon: 'tabler:flag',
    label: 'High Priority',
    value: 'high'
  }
]

/**
 * A simple listbox component for selecting from a list of options.
 */
export const Default: Story = {
  args: {
    children: <></>,
    onChange: () => {},
    renderContent: undefined,
    value: ''
  },
  render: _args => {
    const [value, onChange] = useState('low')

    const selectedOption = OPTIONS.find(o => o.value === value)

    return (
      <Listbox
        renderContent={() => (
          <Flex align="center" gap="sm">
            <Box asChild flexShrink="0">
              <Icon
                color={selectedOption?.color || colors.gray[500]}
                icon={selectedOption?.icon || 'tabler:cube'}
                style={{ height: '1.25rem', width: '1.25rem' }}
              />
            </Box>
            <Text truncate>
              {selectedOption?.label || 'Select an option'}
            </Text>
          </Flex>
        )}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, label, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={label}
            value={value}
          />
        ))}
      </Listbox>
    )
  }
}

/**
 * A disabled listbox — non-interactive.
 */
export const Disabled: Story = {
  args: {
    children: <></>,
    onChange: () => {},
    renderContent: undefined,
    value: 'low'
  },
  render: _args => {
    const [value, onChange] = useState('low')

    const selectedOption = OPTIONS.find(o => o.value === value)

    return (
      <Listbox
        disabled
        renderContent={() => (
          <Flex align="center" gap="sm">
            <Box asChild flexShrink="0">
              <Icon
                color={selectedOption?.color || colors.gray[500]}
                icon={selectedOption?.icon || 'tabler:cube'}
                style={{ height: '1.25rem', width: '1.25rem' }}
              />
            </Box>
            <Text truncate>
              {selectedOption?.label || 'Select an option'}
            </Text>
          </Flex>
        )}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, label, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={label}
            value={value}
          />
        ))}
      </Listbox>
    )
  }
}

/**
 * A listbox with multiple options selected.
 */
export const MultipleOptions: Story = {
  args: {
    children: <></>,
    onChange: () => {},
    renderContent: undefined,
    value: []
  },
  render: _args => {
    const [value, onChange] = useState([OPTIONS[2].value]) // Initialize with an array of values

    return (
      <Listbox
        multiple
        renderContent={() => (
          <Flex align="center" gap="sm" wrap="wrap">
            {(value as string[]).length > 0
              ? (value as string[]).map((v, index) => {
                  const option = OPTIONS.find(o => o.value === v)

                  return (
                    <>
                      <Flex key={index} align="center" gap="sm">
                        <Icon
                          color={option?.color || colors.gray[500]}
                          icon={option?.icon || 'tabler:cube'}
                          style={{
                            flexShrink: 0,
                            height: '1.25rem',
                            width: '1.25rem'
                          }}
                        />
                        <Text whiteSpace="nowrap">{option?.label}</Text>
                      </Flex>
                      {index !== (value as string[]).length - 1 && (
                        <Text
                          asChild
                          color={{ base: 'bg-400', dark: 'bg-600' }}
                          style={{ height: '0.375rem', width: '0.375rem' }}
                        >
                          <Icon icon="tabler:circle-filled" />
                        </Text>
                      )}
                    </>
                  )
                })
              : 'Select options'}
          </Flex>
        )}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, label, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={label}
            value={value}
          />
        ))}
      </Listbox>
    )
  }
}
