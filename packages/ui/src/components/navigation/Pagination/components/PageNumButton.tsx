import { Button } from '@/components/inputs'
import { Text } from '@/components/primitives'

export function PageNumButton({
  number,
  onClick,
  active
}: {
  number: number
  onClick: () => void
  active?: boolean
}) {
  return (
    <Button
      key={1}
      display={{
        base: 'none',
        lg: 'flex'
      }}
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
  )
}
