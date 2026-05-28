import type { Meta, StoryObj } from '@storybook/react-vite'

import { Prose } from './index'

const meta = {
  component: Prose
} satisfies Meta<typeof Prose>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: () => (
    <Prose>
      <h1>Heading 1</h1>
      <p>
        This is a paragraph with <strong>bold</strong>, <em>italic</em>,{' '}
        <code>inline code</code>, and a{' '}
        <a href="#">link</a>.
      </p>
      <h2>Heading 2</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <h3>Heading 3</h3>
      <blockquote>A blockquote for emphasizing important information.</blockquote>
      <h4>Lists</h4>
      <ul>
        <li>Unordered list item one</li>
        <li>Unordered list item two</li>
        <li>Unordered list item three</li>
      </ul>
      <ol>
        <li>Ordered list item one</li>
        <li>Ordered list item two</li>
        <li>Ordered list item three</li>
      </ol>
      <h5>Code Block</h5>
      <pre>
        <code>{`function hello() {
  console.log('Hello, World!')
}`}</code>
      </pre>
      <hr />
      <p>A horizontal rule separates sections above.</p>
    </Prose>
  )
}
