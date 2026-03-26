import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Flex } from '@components/primitives'

import TagChip from './TagChip'

const meta = {
  component: TagChip,
  argTypes: {
    actionButtonProps: {
      control: false
    },
    variant: {
      control: {
        type: 'select',
        options: ['outlined', 'filled']
      }
    }
  }
} satisfies Meta<typeof TagChip>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A simple tag chip with label only.
 */
export const Default: Story = {
  args: {
    label: 'JavaScript'
  },
  render: args => (
    <Flex align="center" gap="sm" height="full" justify="center" width="full">
      <TagChip {...args} />
      <TagChip {...args} variant="filled" />
    </Flex>
  )
}

/**
 * A tag chip with an icon.
 */
export const WithIcon: Story = {
  args: {
    label: 'React',
    icon: 'tabler:brand-react'
  },
  render: args => (
    <Flex align="center" gap="sm" height="full" justify="center" width="full">
      <TagChip {...args} />
      <TagChip {...args} variant="filled" />
    </Flex>
  )
}

/**
 * A tag chip with custom color.
 */
export const WithColor: Story = {
  args: {
    label: 'TypeScript',
    icon: 'tabler:brand-typescript',
    color: 'oklch(0.55 0.18 248)'
  },
  render: args => (
    <Flex align="center" gap="sm" height="full" justify="center" width="full">
      <TagChip {...args} />
      <TagChip {...args} variant="filled" />
    </Flex>
  )
}

/**
 * A tag chip with an action button.
 */
export const WithActionButton: Story = {
  args: {
    label: 'Vue.js',
    icon: 'tabler:brand-vue',
    color: 'oklch(0.65 0.16 150)',
    actionButtonProps: {
      icon: 'tabler:x',
      onClick: () => alert('Tag removed')
    }
  },
  render: args => (
    <Flex align="center" gap="sm" height="full" justify="center" width="full">
      <TagChip {...args} />
      <TagChip {...args} variant="filled" />
    </Flex>
  )
}

/**
 * Multiple tag chips in a row.
 */
export const MultipleTags: Story = {
  args: {
    label: ''
  },
  render: () => (
    <Flex
      align="center"
      direction="column"
      gap="sm"
      height="full"
      justify="center"
      width="full"
    >
      <Flex align="center" gap="sm">
        <TagChip icon="tabler:brand-react" label="React" />
        <TagChip
          color="oklch(0.55 0.18 248)"
          icon="tabler:brand-typescript"
          label="TypeScript"
        />
        <TagChip
          color="oklch(0.65 0.16 150)"
          icon="tabler:brand-vue"
          label="Vue.js"
        />
        <TagChip
          color="oklch(0.50 0.14 30)"
          icon="tabler:brand-angular"
          label="Angular"
        />
      </Flex>
      <Flex align="center" gap="sm">
        <TagChip icon="tabler:brand-react" label="React" variant="filled" />
        <TagChip
          color="oklch(0.55 0.18 248)"
          icon="tabler:brand-typescript"
          label="TypeScript"
          variant="filled"
        />
        <TagChip
          color="oklch(0.65 0.16 150)"
          icon="tabler:brand-vue"
          label="Vue.js"
          variant="filled"
        />
        <TagChip
          color="oklch(0.50 0.14 30)"
          icon="tabler:brand-angular"
          label="Angular"
          variant="filled"
        />
      </Flex>
    </Flex>
  )
}

export const ClickableTag: Story = {
  args: {
    label: 'Clickable Tag',
    icon: 'tabler:tag',
    color: 'oklch(0.6 0.2 220)'
  },
  render: args => (
    <Flex align="center" height="full" justify="center" width="full">
      <TagChip
        {...args}
        onClick={() => {
          alert('Tag clicked!')
        }}
      />
    </Flex>
  )
}

export const SelectableTags: Story = {
  args: {
    label: ''
  },
  render: () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const tags = [
      'React',
      'TypeScript',
      'Vue.js',
      'Angular',
      'Svelte',
      'Ember.js'
    ]

    const toggleTag = (tag: string) => {
      setSelectedTags(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
      )
    }

    return (
      <Flex align="center" gap="sm" height="full" justify="center" width="full">
        {tags.map(tag => (
          <TagChip
            key={tag}
            actionButtonProps={
              selectedTags.includes(tag)
                ? {
                    icon: 'tabler:check'
                  }
                : undefined
            }
            icon="tabler:tag"
            label={tag}
            variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
            onClick={() => toggleTag(tag)}
          />
        ))}
      </Flex>
    )
  }
}
