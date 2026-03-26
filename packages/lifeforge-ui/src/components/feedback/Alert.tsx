import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

import { Flex, Text } from '@components/primitives'

import * as styles from './Alert.css'

const STYLES = {
  note: {
    title: 'Note',
    icon: 'tabler:info-circle',
    color: '#3b82f6'
  },
  warning: {
    title: 'Warning',
    icon: 'tabler:alert-triangle',
    color: '#eab308'
  },
  caution: {
    title: 'Caution',
    icon: 'tabler:alert-hexagon',
    color: '#f97316'
  },
  tip: {
    title: 'Tip',
    icon: 'tabler:bulb',
    color: '#22c55e'
  },
  important: {
    title: 'Important',
    icon: 'tabler:message-exclamation',
    color: '#a855f7'
  }
}

function Alert({
  type,
  className,
  children
}: {
  type: typeof STYLES extends Record<infer K, unknown> ? K : never
  className?: string
  children: React.ReactNode
}) {
  return (
    <Flex
      className={clsx('_alert', styles.wrapper, className)}
      direction="column"
      gap="md"
      p="sm"
      pl="lg"
      position="relative"
      style={
        { '--_alert-stripe-color': STYLES[type].color } as React.CSSProperties
      }
      width="100%"
    >
      <Flex align="center" gap="sm" style={{ color: STYLES[type].color }}>
        <Icon
          icon={STYLES[type].icon}
          style={{ width: '1.5rem', height: '1.5rem' }}
        />
        <Text as="h4" size="lg" weight="medium">
          {STYLES[type].title}
        </Text>
      </Flex>
      <Text as="p" size="base" style={{ marginTop: '-0.5rem' }}>
        {children}
      </Text>
    </Flex>
  )
}

export default Alert
