import { Button } from '@components/inputs'
import { Box, Text } from '@components/primitives'

function PageNumButton({
  number,
  onClick,
  active
}: {
  number: number
  onClick: () => void
  active?: boolean
}) {
  return (
    <Box
      display={{
        base: 'none',
        lg: 'block'
      }}
    >
      <Button
        key={1}
        style={{
          width: '3em',
          height: '3em'
        }}
        variant="plain"
        onClick={onClick}
      >
        <Text
          color={active ? 'custom-500' : 'muted'}
          size={active ? 'lg' : 'base'}
          weight={active ? 'semibold' : 'normal'}
        >
          {number}
        </Text>
      </Button>
    </Box>
  )
}

export default PageNumButton
