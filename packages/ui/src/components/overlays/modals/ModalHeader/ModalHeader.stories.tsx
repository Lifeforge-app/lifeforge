import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/inputs'
import { Box } from '@/components/primitives'

import { ModalHeader } from '.'

const meta = {
  argTypes: {
    headerActions: { control: false },
    appendTitle: { control: false },
    className: { control: 'text' },
    hasAI: { control: 'boolean' },
    icon: { control: 'text' },
    namespace: { control: 'text' },
    onClose: { control: false },
    title: { control: 'text' }
  },
  component: ModalHeader
} satisfies Meta<typeof ModalHeader>

export default meta

type Story = StoryObj<typeof meta>

// ─── Shell ────────────────────────────────────────────────────────────────────

/**
 * Wraps the header in a box that mirrors a modal's internal padding so the
 * layout feels realistic without rendering a full ModalWrapper.
 */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg={{ base: 'bg-50', dark: 'bg-900' }}
      r="xl"
      style={{ maxWidth: '32rem', padding: '1.5rem' }}
      width="100%"
    >
      {children}
    </Box>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * The standard header - icon, translated title, and a close button.
 */
export const Default: Story = {
  args: {
    icon: 'tabler:plus',
    onClose: function () {},
    title: 'Create Item'
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}

/**
 * When the title string has no matching i18n key the raw value is rendered as
 * a fallback. This story passes a value with no translation to demonstrate
 * that behaviour.
 */
export const UntranslatedTitle: Story = {
  args: {
    icon: 'tabler:file-unknown',
    onClose: function () {},
    title: 'untranslated_modal_key_xyz'
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}

/**
 * `hasAI` appends a yellow star icon after the title to signal that the modal
 * contains AI-assisted functionality.
 */
export const WithAIBadge: Story = {
  args: {
    hasAI: true,
    icon: 'tabler:brain',
    onClose: function () {},
    title: 'Smart Suggestions'
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}

/**
 * `appendTitle` renders arbitrary React content immediately after the title
 * text - useful for status badges, version chips, or item counts.
 */
export const WithAppendTitle: Story = {
  args: {
    appendTitle: (
      <span
        style={{
          background: 'color-mix(in srgb, currentColor 12%, transparent)',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.125rem 0.5rem'
        }}
      >
        12
      </span>
    ),
    icon: 'tabler:tag',
    onClose: function () {},
    title: 'Manage Tags'
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}

/**
 * `headerActions` renders an additional button in the right-hand action
 * area, to the left of the close button. The most common use-case is a help
 * button or a secondary action.
 */
export const WithActionButton: Story = {
  args: {
    headerActions: (
      <Button icon="tabler:help" variant="plain" onClick={function () {}} />
    ),
    icon: 'tabler:file-export',
    onClose: function () {},
    title: 'Export Data'
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}

/**
 * Action button with an explicit variant. Here `secondary` is used to give
 * the action button a slightly more prominent visual treatment than the
 * default `plain`.
 */
export const WithActionButtonVariant: Story = {
  args: {
    headerActions: (
      <Button icon="tabler:eye" variant="secondary" onClick={function () {}}>
        Preview
      </Button>
    ),
    icon: 'tabler:send',
    onClose: function () {},
    title: 'Publish Post'
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}

/**
 * All optional features active simultaneously - AI badge, appendTitle, and an
 * action button - to confirm they compose without layout issues.
 */
export const KitchenSink: Story = {
  args: {
    headerActions: (
      <Button icon="tabler:settings" variant="plain" onClick={function () {}} />
    ),
    appendTitle: (
      <span
        style={{
          background: '#4caf5020',
          borderRadius: '9999px',
          color: '#4caf50',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          padding: '0.1rem 0.45rem',
          textTransform: 'uppercase'
        }}
      >
        Beta
      </span>
    ),
    hasAI: true,
    icon: 'tabler:sparkles',
    onClose: function () {},
    title: 'AI Content Generator'
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}

/**
 * When `title` is a React node instead of a string, it is rendered directly
 * without i18n lookup - useful for rich or dynamic headings.
 */
export const ReactNodeTitle: Story = {
  args: {
    icon: 'tabler:edit',
    onClose: function () {},
    title: (
      <span style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
        Edit <strong style={{ color: '#4caf50' }}>Project Alpha</strong>
      </span>
    )
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}

/**
 * A very long title gets truncated with an ellipsis rather than overflowing
 * the available width.
 */
export const LongTitle: Story = {
  args: {
    icon: 'tabler:text-size',
    onClose: function () {},
    title:
      'This Is An Exceptionally Long Modal Title That Might Overflow If Not Truncated Properly'
  },
  render: function (args) {
    return (
      <Shell>
        <ModalHeader {...args} />
      </Shell>
    )
  }
}
