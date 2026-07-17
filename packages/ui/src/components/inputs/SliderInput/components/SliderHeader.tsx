import { useState } from 'react'

import { useInputLabel } from '@/components/inputs/shared/hooks/useInputLabel'
import { Flex, Icon, Text } from '@/components/primitives'
import { useModalStore } from '@/providers'

import { SliderValueModal } from './SliderValueModal'

export function SliderHeader({
  icon,
  label,
  namespace,
  value,
  required,
  max = 100,
  min = 0,
  onChange,
  disabled
}: {
  icon?: string
  label?: string
  namespace?: string | false
  value: number
  required?: boolean
  max?: number
  min?: number
  onChange?: (value: number) => void
  disabled?: boolean
}) {
  const { open } = useModalStore()
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })
  const [isHovered, setIsHovered] = useState(false)

  if (!label || !icon) return null

  function handleValueClick() {
    if (disabled || !onChange) return
    open(SliderValueModal, {
      value,
      min,
      max,
      label: inputLabel,
      icon,
      onConfirm: onChange
    })
  }

  return (
    <Flex
      align="center"
      gap="xl"
      justify="between"
      mb="md"
      minWidth="0"
      width="100%"
    >
      <Text asChild color={{ base: 'bg-400', dark: 'bg-600' }} weight="medium">
        <Flex
          align="center"
          gap="sm"
          minWidth="0"
          style={{ letterSpacing: '0.025em' }}
        >
          <Icon icon={icon} size="1.5rem" />
          <Flex align="center" gap="sm" minWidth="0" width="100%">
            <Text truncate as="div" style={{ width: '100%', minWidth: 0 }}>
              {inputLabel}
            </Text>
            {required && <span style={{ color: '#ef4444' }}>*</span>}
          </Flex>
        </Flex>
      </Text>
      <Flex align="center" gap="sm">
        <span
          style={{
            cursor: disabled || !onChange ? 'default' : 'pointer',
            textDecoration:
              !disabled && onChange && isHovered ? 'underline' : 'none',
            transition: 'all 0.2s ease'
          }}
          onClick={handleValueClick}
          onMouseEnter={() => {
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
        >
          {value}
        </span>
        <Text color="muted" style={{ fontSize: '0.75rem' }}>
          /{max}
        </Text>
      </Flex>
    </Flex>
  )
}
