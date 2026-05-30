import { useInputLabel } from '@/components/inputs/shared/hooks/useInputLabel'
import { Flex, Icon, Text } from '@/components/primitives'

export function SliderHeader({
  icon,
  label,
  namespace,
  value,
  required,
  max = 100
}: {
  icon?: string
  label?: string
  namespace?: string
  value: number
  required?: boolean
  max?: number
}) {
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

  if (!label || !icon) return null

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
          <Icon
            icon={icon}
            style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }}
          />
          <Flex align="center" gap="sm" minWidth="0" width="100%">
            <Text truncate as="div" style={{ width: '100%', minWidth: 0 }}>
              {inputLabel}
            </Text>
            {required && <span style={{ color: '#ef4444' }}>*</span>}
          </Flex>
        </Flex>
      </Text>
      <Flex align="center" gap="sm">
        <span>{value}</span>
        <Text color="muted" style={{ fontSize: '0.75rem' }}>
          /{max}
        </Text>
      </Flex>
    </Flex>
  )
}
