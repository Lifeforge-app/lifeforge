import { Box } from '@lifeforge/ui'

interface BorderRadiusIconProps {
  radius: number
  className?: string
}

function BorderRadiusIcon({ radius }: BorderRadiusIconProps) {
  const r = Math.min(radius * 2, 6.5)

  return (
    <Box asChild flexShrink="0" height="1.25em" mr="sm" width="1.25em">
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M 1.5 14.5 L 1.5 ${1.5 + r} Q 1.5 1.5 ${1.5 + r} 1.5 L 14.5 1.5`}
          strokeLinecap="round"
        />
      </svg>
    </Box>
  )
}

export default BorderRadiusIcon
