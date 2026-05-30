import type { Meta, StoryObj } from '@storybook/react-vite'

import { ScrollableStory } from '@/storybook/ScrollableStory'

import { Prose } from './index'

const meta = {
  component: Prose
} satisfies Meta<typeof Prose>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: () => (
    <ScrollableStory>
      <Prose>
        <h1>The Joke Tax Chronicles</h1>
        <p>
          Once upon a time, in a far-off land, there was a king who loved jokes.
          He had a special tax - the <strong>Joke Tax</strong> - which required
          everyone to tell a joke or pay a fine so the royal coffers could grow.
        </p>
        <h2>The King&apos;s Plan</h2>
        <p>
          One day, the king asked his <a href="#">court mathematician</a> to
          calculate how many jokes were needed to fund the annual royal feast.
          The mathematician said:
        </p>
        <blockquote>
          If each subject tells exactly one joke per week, and the royal
          treasury gains <code>5 gold coins</code> per joke, then the kingdom
          will have enough to throw a feast every fortnight.
        </blockquote>
        <p>
          The king grinned. <em>&ldquo;Brilliant!&rdquo;</em> he exclaimed. But
          he also wanted a list of the top categories.
        </p>
        <h3>Top Categories</h3>
        <ol>
          <li>Puns about food</li>
          <li>
            Knock-knock jokes
            <ul>
              <li>Standard knock-knock</li>
              <li>Reverse knock-knock</li>
            </ul>
          </li>
          <li>Programming one-liners</li>
        </ol>
        <h3>Sample Code</h3>
        <p>
          The court scribe wrote a Python script to track the joke inventory:
        </p>
        <pre>
          <code>{`def count_jokes(subjects):
    total = 0
    for s in subjects:
        total += s.jokes_per_week
    return total`}</code>
        </pre>
        <p>
          Inside the code, a variable like <code>total</code> stores the running
          count. The king admired the logic.
        </p>
        <h4>Edge Cases</h4>
        <p>
          What happens when a subject tells the same joke twice? The
          mathematician recommended tracking duplicates with a <kbd>Ctrl+Z</kbd>{' '}
          - or rather, a rollback function.
        </p>
        <h3>Table of Royal Expenses</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Cost (gold)</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Roasted boar</td>
              <td>50</td>
              <td>10</td>
            </tr>
            <tr>
              <td>Barrels of mead</td>
              <td>30</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Jester hat</td>
              <td>5</td>
              <td>1</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tfoot>
        </table>
        <h4>Glossary of Terms</h4>
        <dl>
          <dt>Joke Tax</dt>
          <dd>A levy collected in the form of humour rather than coin.</dd>
          <dt>Fortnight</dt>
          <dd>A period of fourteen days - also known as two weeks.</dd>
          <dt>Rollback</dt>
          <dd>To undo the last action, like a wise programmer would.</dd>
        </dl>
        <figure>
          <picture>
            <img
              alt="The royal court laughing"
              src="https://picsum.photos/seed/joketax/800/400"
              style={{ width: '100%' }}
            />
          </picture>
          <figcaption>
            The royal court enjoying a particularly good pun.
          </figcaption>
        </figure>
        <hr />
        <p>
          And so, the kingdom thrived - one joke at a time (provided they were
          original and not just a `console.log`).
        </p>
      </Prose>
    </ScrollableStory>
  )
}
