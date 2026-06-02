import type { Meta, StoryObj } from '@storybook/react-vite'
import _ from 'lodash'

import { Alert } from '@/components/feedback'
import { Card } from '@/components/layout'
import { Box, Flex, Grid } from '@/components/primitives'
import { ScrollableStory } from '@/storybook/ScrollableStory'
import { VariantContainer } from '@/storybook/VariantContainer'

import { Button } from './index'

const meta = {
  component: Button,
  title: 'Inputs/Button'
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

const variants = ['primary', 'secondary', 'tertiary', 'plain'] as const

export const AllVariants: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <ScrollableStory>
      {variants.map(variant => (
        <Box key={variant} width="100%">
          <VariantContainer title={variant}>
            <Card width="100%">
              <Grid gap="md" templateCols={2}>
                {[false, true].map(dangerous => (
                  <>
                    <Button
                      dangerous={dangerous}
                      icon="tabler:cube"
                      variant={variant}
                    >
                      {_.startCase(variant)}
                      {dangerous ? ' (Dangerous)' : ''}
                    </Button>
                    <Button
                      disabled
                      dangerous={dangerous}
                      icon="tabler:cube"
                      variant={variant}
                    >
                      {_.startCase(variant)}
                      {dangerous ? ' (Dangerous)' : ''}
                    </Button>
                  </>
                ))}
              </Grid>
            </Card>
          </VariantContainer>
        </Box>
      ))}
    </ScrollableStory>
  )
}

/**
 * A button with the icon positioned at the end.
 */
export const IconAtEnd: Story = {
  args: {
    children: 'Proceed',
    icon: 'tabler:arrow-right',
    iconPosition: 'end',
    loading: false,
    tProps: {}
  },
  render: props => <Button {...props} />
}

/**
 * A button that indicates an action is in progress. A loading spinner is shown, and user input is disabled.
 */
export const Loading: Story = {
  args: {
    children: 'Loading',
    disabled: false,
    icon: 'tabler:arrow-right',
    iconPosition: 'start',
    loading: true,
    tProps: {}
  },
  render: props => <Button {...props} />
}

/**
 * A button that displays only an icon.
 */
export const IconsOnly: Story = {
  args: {
    children: '',
    icon: 'tabler:arrows-exchange',
    tProps: {}
  },
  render: props => <Button {...props} />
}

/**
 * A plain button that displays only an icon.
 */
export const IconsOnlyWithNoBg: Story = {
  args: {
    children: '',
    icon: 'tabler:arrows-exchange',
    tProps: {},
    variant: 'plain'
  },
  render: props => <Button {...props} />
}

/**
 * A button with a long text that exceeds the typical length. This tests how the button handles overflow and truncation of text.
 */
export const WithLongText: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    icon: 'tabler:text-wrap',
    tProps: {}
  },
  render: props => (
    <Flex
      align="center"
      direction="column"
      justify="center"
      minWidth="0"
      width="100%"
    >
      <Flex
        style={{
          width: 'clamp(40vw, 40em, 80vw)'
        }}
      >
        <Button style={{ width: '100%' }} {...props} />
      </Flex>
    </Flex>
  )
}

export const AsDifferentComponent: Story = {
  args: {
    as: 'a',
    children: 'Open Link',
    href: 'https://docs.lifeforge.dev',
    icon: 'tabler:external-link',
    rel: 'noopener noreferrer',
    target: '_blank',
    tProps: {},
    variant: 'plain'
  },
  render: props => (
    <Flex
      align="center"
      direction="column"
      gap="md"
      justify="center"
      width="100%"
    >
      <Alert type="note">
        This button is rendered as an anchor tag that navigates to the LifeForge
        documentation. Open the console and inspect the element to verify that
        it is an anchor tag with the correct href, target, and rel attributes.
      </Alert>
      <Button {...props} />
    </Flex>
  )
}
