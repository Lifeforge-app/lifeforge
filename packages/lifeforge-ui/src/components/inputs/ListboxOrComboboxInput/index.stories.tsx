import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import ListboxOrComboboxOption from './components/ListboxOrComboboxOption'
import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '',
    setValue: () => {},
    type: 'listbox',
    children: <></>,
    name: 'Category',
    icon: 'tabler:cube',
    buttonContent: <></>,
    namespace: false
  },
  render: props => {
    const [value, setValue] = useState('')
    return (
      <Index
        {...props}
        buttonContent={<>Option {value}</>}
        setValue={setValue}
        type="listbox"
        value={value}
      >
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <ListboxOrComboboxOption key={i} text={`Option ${i}`} value={i} />
          ))}
      </Index>
    )
  }
}
