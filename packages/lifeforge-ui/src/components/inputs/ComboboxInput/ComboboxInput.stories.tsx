import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { ComboboxOption } from './components/ComboboxOption'
import { ComboboxInput } from './index'
import { TAILWIND_PALETTE } from '@/system'

const meta = {
  argTypes: {
    children: {
      control: false
    },
    displayValue: {
      control: false
    },
    onChange: {
      control: false
    },
    onQueryChanged: {
      control: false
    },
    value: {
      control: false
    }
  },
  component: ComboboxInput
} satisfies Meta<typeof ComboboxInput>

export default meta

type Story = StoryObj<typeof meta>

const COUNTRIES = [
  {
    icon: 'circle-flags:us',
    name: 'United States',
    value: 'us'
  },
  { icon: 'circle-flags:uk', name: 'United Kingdom', value: 'uk' },
  { icon: 'circle-flags:jp', name: 'Japan', value: 'jp' },
  { icon: 'circle-flags:fr', name: 'France', value: 'fr' },
  { icon: 'circle-flags:de', name: 'Germany', value: 'de' }
]

/**
 * A combobox input that allows users to search and select from a list of options.
 */
export const Default: Story = {
  args: {
    children: <></>,
    displayValue: () => '',
    icon: 'tabler:world',
    label: 'Country',
    onChange: () => {},
    onQueryChanged: () => {},
    value: null
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
            color={TAILWIND_PALETTE.blue[500]}
            icon={country.icon}
            label={country.name}
            value={country}
          />
        ))}
      </ComboboxInput>
    )
  }
}

/**
 * A required combobox input for form validation.
 */
export const Required: Story = {
  args: {
    children: <></>,
    displayValue: () => '',
    icon: 'tabler:world',
    label: 'Country',
    onChange: () => {},
    onQueryChanged: () => {},
    required: true,
    value: null
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
            color={TAILWIND_PALETTE.blue[500]}
            icon={country.icon}
            label={country.name}
            value={country}
          />
        ))}
      </ComboboxInput>
    )
  }
}

const PRIORITY_LEVELS = [
  { color: TAILWIND_PALETTE.green[500], label: 'Low', value: 'low' },
  { color: TAILWIND_PALETTE.yellow[500], label: 'Medium', value: 'medium' },
  { color: TAILWIND_PALETTE.orange[500], label: 'High', value: 'high' },
  { color: TAILWIND_PALETTE.red[500], label: 'Critical', value: 'critical' }
]

/**
 * Options with a color dot instead of an icon — useful for status/priority pickers.
 */
export const OptionsWithColorDot: Story = {
  args: {
    children: <></>,
    displayValue: () => '',
    icon: 'tabler:flag',
    label: 'Priority',
    onChange: () => {},
    onQueryChanged: () => {},
    value: null
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
    )
  }
}

const ALL_TIMEZONES = Intl.supportedValuesOf('timeZone')

/**
 * A large list of options demonstrating search filtering across many items.
 */
export const LargeOptionList: Story = {
  args: {
    children: <></>,
    displayValue: () => '',
    icon: 'tabler:clock',
    label: 'Timezone',
    onChange: () => {},
    onQueryChanged: () => {},
    value: null
  },
  render: args => {
    const [value, onChange] = useState(ALL_TIMEZONES[0])

    const [query, setQuery] = useState('')

    const filtered =
      query === ''
        ? ALL_TIMEZONES
        : ALL_TIMEZONES.filter(tz =>
            tz.toLowerCase().includes(query.toLowerCase())
          )

    return (
      <ComboboxInput
        {...args}
        displayValue={(tz: (typeof ALL_TIMEZONES)[0] | null) => tz || ''}
        value={value}
        onChange={onChange}
        onQueryChanged={setQuery}
      >
        {filtered.map(tz => (
          <ComboboxOption key={tz} label={tz} value={tz} />
        ))}
      </ComboboxInput>
    )
  }
}

/**
 * A combobox input in disabled state.
 */
export const Disabled: Story = {
  args: {
    children: <></>,
    disabled: true,
    displayValue: () => '',
    icon: 'tabler:world',
    label: 'Country',
    onChange: () => {},
    onQueryChanged: () => {},
    value: COUNTRIES[0]
  },
  render: args => {
    const [value, onChange] = useState(COUNTRIES[0])

    const [, setQuery] = useState('')

    return (
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
            color={TAILWIND_PALETTE.blue[500]}
            icon={country.icon}
            label={country.name}
            value={country}
          />
        ))}
      </ComboboxInput>
    )
  }
}

export const WithErrorMessage: Story = {
  args: {
    children: <></>,
    displayValue: () => '',
    errorMsg: 'Invalid for some reason',
    icon: 'tabler:world',
    label: 'Country',
    onChange: () => {},
    onQueryChanged: () => {},
    value: null
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
            color={TAILWIND_PALETTE.blue[500]}
            icon={country.icon}
            label={country.name}
            value={country}
          />
        ))}
      </ComboboxInput>
    )
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    children: <></>,
    disabled: true,
    displayValue: () => '',
    errorMsg: 'Invalid for some reason',
    icon: 'tabler:world',
    label: 'Country',
    onChange: () => {},
    onQueryChanged: () => {},
    value: null
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
            color={TAILWIND_PALETTE.blue[500]}
            icon={country.icon}
            label={country.name}
            value={country}
          />
        ))}
      </ComboboxInput>
    )
  }
}

/**
 * The plain variant renders as a compact rounded box without an underline or floating label.
 */
export const PlainVariant: Story = {
  args: {
    children: <></>,
    displayValue: () => '',
    onChange: () => {},
    onQueryChanged: () => {},
    value: null,
    variant: 'plain'
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
            color={TAILWIND_PALETTE.blue[500]}
            icon={country.icon}
            label={country.name}
            value={country}
          />
        ))}
      </ComboboxInput>
    )
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    children: <></>,
    displayValue: () => '',
    errorMsg: 'Invalid for some reason',
    icon: 'tabler:world',
    label: 'Country',
    onChange: () => {},
    onQueryChanged: () => {},
    value: null,
    variant: 'plain'
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
            color={TAILWIND_PALETTE.blue[500]}
            icon={country.icon}
            label={country.name}
            value={country}
          />
        ))}
      </ComboboxInput>
    )
  }
}
