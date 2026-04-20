import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { Box, Flex, Text } from '@components/primitives'

import useInputLabel from '../shared/hooks/useInputLabel'

interface SliderInputProps {
  /** The label text displayed above the slider field. */
  label?: string
  /** The icon to display next to the slider. Should be a valid icon name from Iconify. */
  icon?: string
  /** The current numeric value of the slider. */
  value: number
  /** Callback function called when the slider value changes. */
  onChange: (value: number) => void
  /** Whether the slider field is required for form validation. */
  required?: boolean
  /** Whether the slider is disabled and non-interactive. */
  disabled?: boolean
  /** The minimum value allowed for the slider. */
  min?: number
  /** The maximum value allowed for the slider. */
  max?: number
  /** The step increment for slider value changes. */
  step?: number
  /** Additional CSS class names to apply to the slider container. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** Additional CSS class names to apply to the outer wrapper of the component. Use `!` suffix for Tailwind CSS class overrides. */
  wrapperClassName?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
}

function SliderInput({
  label,
  icon,
  value,
  onChange,
  required,
  disabled,
  min = 0,
  max = 100,
  step = 1,
  className,
  wrapperClassName,
  namespace
}: SliderInputProps) {
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

  return (
    <Box className={wrapperClassName} width="100%">
      {icon && label && (
        <Flex
          align="center"
          gap="xl"
          justify="between"
          mb="md"
          minWidth="0"
          width="100%"
        >
          <Text
            asChild
            color={{ base: 'bg-400', dark: 'bg-600' }}
            weight="medium"
          >
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
            <Text color="bg-500" style={{ fontSize: '0.75rem' }}>
              /{max}
            </Text>
          </Flex>
        </Flex>
      )}
      <Box width="100%">
        <Box
          asChild
          shadow
          bg={{ base: 'bg-200', dark: 'bg-800' }}
          width="100%"
        >
          <input
            className={clsx('range range-primary', className)}
            disabled={disabled}
            max={max}
            min={min}
            step={step}
            type="range"
            value={value}
            onChange={e => {
              onChange(parseFloat(e.target.value))
            }}
          />
        </Box>
        <Flex
          justify="between"
          mb="md"
          style={{
            fontSize: '0.75rem',
            paddingLeft: '0.625rem',
            paddingRight: '0.625rem'
          }}
          width="100%"
        >
          {[min, ((min + max) / 2).toFixed(1), max].map((label, index) => (
            <Box
              key={`title-${label}-${index}`}
              bg={{ base: 'bg-300', dark: 'bg-700' }}
              position="relative"
              rounded="full"
              style={{ height: '0.5rem', width: '0.125rem' }}
            >
              <Text
                asChild
                color={{ base: 'bg-400', dark: 'bg-600' }}
                weight="medium"
              >
                <Box
                  position="absolute"
                  style={{
                    bottom: '-1.25rem',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {label}
                </Box>
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  )
}

export default SliderInput
