import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import ComboboxOption from './components/ComboboxOption'
import ComboboxInput from './index'

const meta = {
  component: ComboboxInput,
  argTypes: {
    value: {
      control: false
    },
    onChange: {
      control: false
    },
    onQueryChanged: {
      control: false
    },
    displayValue: {
      control: false
    },
    children: {
      control: false
    }
  }
} satisfies Meta<typeof ComboboxInput>

export default meta

type Story = StoryObj<typeof meta>

const COUNTRIES = [
  { value: 'us', name: 'United States', icon: 'circle-flags:us' },
  { value: 'uk', name: 'United Kingdom', icon: 'circle-flags:uk' },
  { value: 'jp', name: 'Japan', icon: 'circle-flags:jp' },
  { value: 'fr', name: 'France', icon: 'circle-flags:fr' },
  { value: 'de', name: 'Germany', icon: 'circle-flags:de' }
]

/**
 * A combobox input that allows users to search and select from a list of options.
 */
export const Default: Story = {
  args: {
    label: 'Country',
    icon: 'tabler:world',
    value: null,
    onChange: () => {},
    onQueryChanged: () => {},
    displayValue: () => '',
    children: <></>
  },
  render: args => {
    const [value, onChange] = useState(COUNTRIES[0])

    const [query, setQuery] = useState('')

    const filteredCountries =
      query === ''
        ? COUNTRIES
        : COUNTRIES.filter(country =>
            country.name.toLowerCase().includes(query.toLowerCase())
          )

    return (
      <div className="w-96">
        <ComboboxInput
          {...args}
          displayValue={(country: (typeof COUNTRIES)[0] | null) =>
            country?.name || ''
          }
          value={value}
          onChange={onChange}
          onQueryChanged={setQuery}
        >
          {filteredCountries.map(country => (
            <ComboboxOption
              key={country.value}
              color={colors.blue[500]}
              icon={country.icon}
              label={country.name}
              value={country}
            />
          ))}
        </ComboboxInput>
      </div>
    )
  }
}

/**
 * A combobox input in disabled state.
 */
export const Disabled: Story = {
  args: {
    label: 'Country',
    icon: 'tabler:world',
    value: COUNTRIES[0],
    onChange: () => {},
    onQueryChanged: () => {},
    displayValue: () => '',
    disabled: true,
    children: <></>
  },
  render: args => {
    const [value, onChange] = useState(COUNTRIES[0])

    const [, setQuery] = useState('')

    return (
      <div className="w-96">
        <ComboboxInput
          {...args}
          displayValue={(country: (typeof COUNTRIES)[0] | null) =>
            country?.name || ''
          }
          value={value}
          onChange={onChange}
          onQueryChanged={setQuery}
        >
          {COUNTRIES.map(country => (
            <ComboboxOption
              key={country.value}
              color={colors.blue[500]}
              icon={country.icon}
              label={country.name}
              value={country}
            />
          ))}
        </ComboboxInput>
      </div>
    )
  }
}

/**
 * A required combobox input for form validation.
 */
export const Required: Story = {
  args: {
    label: 'Country',
    icon: 'tabler:world',
    value: null,
    onChange: () => {},
    onQueryChanged: () => {},
    displayValue: () => '',
    required: true,
    children: <></>
  },
  render: args => {
    const [value, onChange] = useState<(typeof COUNTRIES)[0] | null>(null)

    const [query, setQuery] = useState('')

    const filteredCountries =
      query === ''
        ? COUNTRIES
        : COUNTRIES.filter(country =>
            country.name.toLowerCase().includes(query.toLowerCase())
          )

    return (
      <div className="w-96">
        <ComboboxInput
          {...args}
          displayValue={(country: (typeof COUNTRIES)[0] | null) =>
            country?.name || ''
          }
          value={value}
          onChange={onChange}
          onQueryChanged={setQuery}
        >
          {filteredCountries.map(country => (
            <ComboboxOption
              key={country.value}
              color={colors.blue[500]}
              icon={country.icon}
              label={country.name}
              value={country}
            />
          ))}
        </ComboboxInput>
      </div>
    )
  }
}
