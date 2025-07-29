import { Icon } from '@iconify/react/dist/iconify.js'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import ListboxOption from './components/ListboxOption'
import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

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

export const Default: Story = {
  args: {
    name: 'Category',
    icon: 'tabler:category',
    value: '',
    setValue: () => {},
    namespace: 'namespace',
    buttonContent: <></>,
    children: <></>
  },
  render: args => {
    const [value, setValue] = useState('Option 1')

    return (
      <Index
        {...args}
        buttonContent={
          <span className="flex items-center gap-2">
            <Icon
              className="size-5"
              color={
                OPTIONS.find(o => o.value === value)?.color || colors.gray[500]
              }
              icon={OPTIONS.find(o => o.value === value)?.icon || 'tabler:cube'}
            />
            {value || 'Select an option'}
          </span>
        }
        className="w-96"
        disabled={false}
        setValue={setValue}
        value={value}
      >
        {OPTIONS.map(({ color, icon, text, value }, index) => (
          <ListboxOption
            key={index}
            color={color}
            icon={icon}
            text={text}
            value={value}
          />
        ))}
      </Index>
    )
  }
}

export const MultipleSelection: Story = {
  args: {
    name: 'Category',
    icon: 'tabler:category',
    value: '',
    namespace: 'namespace',
    buttonContent: <></>,
    children: <></>,
    multiple: true,
    setValue: () => {}
  },

  render: args => {
    const [value, setValue] = useState(['Option 1', 'Option 2'])

    return (
      <Index
        {...args}
        buttonContent={
          <span className="flex flex-wrap items-center gap-2">
            {value.length > 0
              ? value.map((v, index) => (
                  <>
                    <span key={index} className="flex items-center gap-2">
                      <Icon
                        className="size-5 shrink-0"
                        color={
                          OPTIONS.find(o => o.value === v)?.color ||
                          colors.gray[500]
                        }
                        icon={
                          OPTIONS.find(o => o.value === v)?.icon ||
                          'tabler:cube'
                        }
                      />
                      <span className="whitespace-nowrap">{v}</span>
                    </span>
                    {index !== value.length - 1 && (
                      <Icon
                        className="text-bg-400 dark:text-bg-600 size-1.5"
                        icon="tabler:circle-filled"
                      />
                    )}
                  </>
                ))
              : 'Select options'}
          </span>
        }
        className="w-96"
        disabled={false}
        setValue={setValue}
        value={value}
      >
        {OPTIONS.map(({ color, icon, text, value }, index) => (
          <ListboxOption
            key={index}
            color={color}
            icon={icon}
            text={text}
            value={value}
          />
        ))}
      </Index>
    )
  }
}
