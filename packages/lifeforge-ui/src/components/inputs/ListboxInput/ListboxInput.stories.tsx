import { Icon } from '@iconify/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import { Box, Flex, Text } from '@components/primitives'

import { ListboxNullOption } from './components/ListboxNullOption'
import { ListboxOption } from './components/ListboxOption'
import { ListboxInput } from './index'

const meta = {
  component: ListboxInput
} satisfies Meta<typeof ListboxInput>

export default meta

type Story = StoryObj<typeof meta>

const OPTIONS = [
  {
    color: colors.blue[500],
    icon: 'tabler:number-1',
    text: 'Option 1',
    value: 'Option 1'
  },
  {
    color: colors.green[500],
    icon: 'tabler:number-2',
    text: 'Option 2',
    value: 'Option 2'
  },
  {
    color: colors.red[500],
    icon: 'tabler:number-3',
    text: 'Option 3',
    value: 'Option 3'
  }
]

function OptionButtonContent({ value }: { value: string }) {
  const option = OPTIONS.find(o => o.value === value)

  return (
    <Flex align="center" gap="sm">
      <Icon
        color={option?.color ?? colors.gray[500]}
        icon={option?.icon ?? 'tabler:cube'}
        style={{ flexShrink: 0, height: '1.25rem', width: '1.25rem' }}
      />
      <Text truncate>{value || 'Select an option'}</Text>
    </Flex>
  )
}

/**
 * The default ListboxInput with a label, icon, and a list of options.
 */
export const Default: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    icon: 'tabler:category',
    label: 'Category',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },
  render: args => {
    const [value, onChange] = useState('Option 1')

    return (
      <ListboxInput
        {...args}
        buttonContent={<OptionButtonContent value={value} />}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}

/**
 * A required ListboxInput for form validation. Renders an asterisk next to the label.
 */
export const Required: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    icon: 'tabler:category',
    label: 'Category',
    namespace: 'namespace',
    onChange: () => {},
    required: true,
    value: ''
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <ListboxInput
        {...args}
        buttonContent={<OptionButtonContent value={value} />}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}

/**
 * A disabled ListboxInput — non-interactive and visually dimmed.
 */
export const Disabled: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    disabled: true,
    icon: 'tabler:category',
    label: 'Category',
    namespace: 'namespace',
    onChange: () => {},
    value: 'Option 1'
  },
  render: args => {
    const [value, onChange] = useState('Option 1')

    return (
      <ListboxInput
        {...args}
        buttonContent={<OptionButtonContent value={value} />}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}

/**
 * A ListboxInput showing an error message, e.g. after failed form validation.
 */
export const WithErrorMessage: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    errorMsg: 'Please select a category',
    icon: 'tabler:category',
    label: 'Category',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <ListboxInput
        {...args}
        buttonContent={<OptionButtonContent value={value} />}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    disabled: true,
    errorMsg: 'Please select a category',
    icon: 'tabler:category',
    label: 'Category',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <ListboxInput
        {...args}
        buttonContent={<OptionButtonContent value={value} />}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}

/**
 * The plain variant renders as a compact rounded box without an underline or floating label.
 */
export const PlainVariant: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    onChange: () => {},
    value: '',
    variant: 'plain'
  },
  render: args => {
    const [value, onChange] = useState('Option 1')

    return (
      <ListboxInput
        {...args}
        buttonContent={<OptionButtonContent value={value} />}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}

/**
 * The small-size plain variant, useful for compact UIs like table rows or toolbars.
 */
export const PlainVariantSmall: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    onChange: () => {},
    size: 'small',
    value: '',
    variant: 'plain'
  },
  render: args => {
    const [value, onChange] = useState('Option 1')

    return (
      <Box width="16rem">
        <ListboxInput
          {...args}
          buttonContent={<OptionButtonContent value={value} />}
          value={value}
          onChange={onChange}
        >
          {OPTIONS.map(({ color, icon, text, value }) => (
            <ListboxOption
              key={value}
              color={color}
              icon={icon}
              label={text}
              value={value}
            />
          ))}
        </ListboxInput>
      </Box>
    )
  }
}

/**
 * Allows selecting multiple options at once. Shows selected count in the button.
 */
export const MultipleSelection: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    icon: 'tabler:category',
    label: 'Category',
    multiple: true,
    namespace: 'namespace',
    onChange: () => {},
    value: []
  },
  render: args => {
    const [value, onChange] = useState(['Option 1', 'Option 2'])

    return (
      <ListboxInput
        {...args}
        buttonContent={
          <Flex align="center" gap="sm" wrap="wrap">
            {value.length > 0 ? (
              value.map((v, index) => (
                <>
                  <Flex key={index} align="center" gap="sm">
                    <Icon
                      color={
                        OPTIONS.find(o => o.value === v)?.color ??
                        colors.gray[500]
                      }
                      icon={
                        OPTIONS.find(o => o.value === v)?.icon ?? 'tabler:cube'
                      }
                      style={{
                        flexShrink: 0,
                        height: '1.25rem',
                        width: '1.25rem'
                      }}
                    />
                    <Text whiteSpace="nowrap">{v}</Text>
                  </Flex>
                  {index !== value.length - 1 && (
                    <Text
                      asChild
                      color={{ base: 'bg-400', dark: 'bg-600' }}
                      style={{ height: '0.375rem', width: '0.375rem' }}
                    >
                      <Icon icon="tabler:circle-filled" />
                    </Text>
                  )}
                </>
              ))
            ) : (
              <Text color="muted">Select options</Text>
            )}
          </Flex>
        }
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}

/**
 * ListboxInput with a null option at the top for clearing the selection.
 */
export const WithNullOption: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    icon: 'tabler:category',
    label: 'Category',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <ListboxInput
        {...args}
        buttonContent={
          value ? (
            <OptionButtonContent value={value} />
          ) : (
            <Text color="muted">None</Text>
          )
        }
        value={value}
        onChange={onChange}
      >
        <ListboxNullOption icon="tabler:x" text="None" value="" />
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    buttonContent: <></>,
    children: <></>,
    errorMsg: 'Invalid options selected',
    onChange: () => {},
    value: '',
    variant: 'plain'
  },

render: args => {
    const [value, onChange] = useState('Option 1')

    return (
      <ListboxInput
        {...args}
        buttonContent={<OptionButtonContent value={value} />}
        value={value}
        onChange={onChange}
      >
        {OPTIONS.map(({ color, icon, text, value }) => (
          <ListboxOption
            key={value}
            color={color}
            icon={icon}
            label={text}
            value={value}
          />
        ))}
      </ListboxInput>
    )
  }
}
