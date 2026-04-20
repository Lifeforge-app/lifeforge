import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import { Box } from '@components/primitives'

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
  {
    value: 'us',
    name: 'United States wiegjewiojgiowrjgiorwjiobji3ojgioweg',
    icon: 'circle-flags:us'
  },
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
      <Box width="24rem">
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
      </Box>
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
      <Box width="24rem">
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
      </Box>
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
      <Box width="24rem">
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
      </Box>
    )
  }
}

/**
 * The plain variant renders as a compact rounded box without an underline or floating label.
 */
export const PlainVariant: Story = {
  args: {
    variant: 'plain',
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
      <Box width="16rem">
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
      </Box>
    )
  }
}

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: colors.green[500] },
  { value: 'medium', label: 'Medium', color: colors.yellow[500] },
  { value: 'high', label: 'High', color: colors.orange[500] },
  { value: 'critical', label: 'Critical', color: colors.red[500] }
]

/**
 * Options with a color dot instead of an icon — useful for status/priority pickers.
 */
export const OptionsWithColorDot: Story = {
  args: {
    label: 'Priority',
    icon: 'tabler:flag',
    value: null,
    onChange: () => {},
    onQueryChanged: () => {},
    displayValue: () => '',
    children: <></>
  },
  render: args => {
    const [value, onChange] = useState(PRIORITY_LEVELS[0])

    const [query, setQuery] = useState('')

    const filtered =
      query === ''
        ? PRIORITY_LEVELS
        : PRIORITY_LEVELS.filter(p =>
            p.label.toLowerCase().includes(query.toLowerCase())
          )

    return (
      <Box width="24rem">
        <ComboboxInput
          {...args}
          displayValue={(p: (typeof PRIORITY_LEVELS)[0] | null) =>
            p?.label || ''
          }
          value={value}
          onChange={onChange}
          onQueryChanged={setQuery}
        >
          {filtered.map(p => (
            <ComboboxOption
              key={p.value}
              color={p.color}
              label={p.label}
              value={p}
            />
          ))}
        </ComboboxInput>
      </Box>
    )
  }
}

/**
 * Options with `noCheckmark` — the selected indicator is hidden.
 */
export const OptionsWithNoCheckmark: Story = {
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
      <Box width="24rem">
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
              noCheckmark
              color={colors.blue[500]}
              icon={country.icon}
              label={country.name}
              value={country}
            />
          ))}
        </ComboboxInput>
      </Box>
    )
  }
}

const ALL_TIMEZONES = [
  {
    value: 'utc',
    label: 'UTC (Coordinated Universal Time) wiugwu4giju43igj43o'
  },
  { value: 'us-eastern', label: 'US/Eastern (UTC-5)' },
  { value: 'us-central', label: 'US/Central (UTC-6)' },
  { value: 'us-mountain', label: 'US/Mountain (UTC-7)' },
  { value: 'us-pacific', label: 'US/Pacific (UTC-8)' },
  { value: 'eu-london', label: 'Europe/London (UTC+0)' },
  { value: 'eu-paris', label: 'Europe/Paris (UTC+1)' },
  { value: 'eu-berlin', label: 'Europe/Berlin (UTC+1)' },
  { value: 'eu-moscow', label: 'Europe/Moscow (UTC+3)' },
  { value: 'asia-kualalumpur', label: 'Asia/Kuala_Lumpur (UTC+8)' },
  { value: 'asia-dubai', label: 'Asia/Dubai (UTC+4)' },
  { value: 'asia-kolkata', label: 'Asia/Kolkata (UTC+5:30)' },
  { value: 'asia-bangkok', label: 'Asia/Bangkok (UTC+7)' },
  { value: 'asia-shanghai', label: 'Asia/Shanghai (UTC+8)' },
  { value: 'asia-tokyo', label: 'Asia/Tokyo (UTC+9)' },
  { value: 'pacific-auckland', label: 'Pacific/Auckland (UTC+12)' }
]

/**
 * A large list of options demonstrating search filtering across many items.
 */
export const LargeOptionList: Story = {
  args: {
    label: 'Timezone',
    icon: 'tabler:clock',
    value: null,
    onChange: () => {},
    onQueryChanged: () => {},
    displayValue: () => '',
    children: <></>
  },
  render: args => {
    const [value, onChange] = useState(ALL_TIMEZONES[0])

    const [query, setQuery] = useState('')

    const filtered =
      query === ''
        ? ALL_TIMEZONES
        : ALL_TIMEZONES.filter(tz =>
            tz.label.toLowerCase().includes(query.toLowerCase())
          )

    return (
      <Box width="24rem">
        <ComboboxInput
          {...args}
          displayValue={(tz: (typeof ALL_TIMEZONES)[0] | null) =>
            tz?.label || ''
          }
          value={value}
          onChange={onChange}
          onQueryChanged={setQuery}
        >
          {filtered.map(tz => (
            <ComboboxOption key={tz.value} label={tz.label} value={tz} />
          ))}
        </ComboboxInput>
      </Box>
    )
  }
}
