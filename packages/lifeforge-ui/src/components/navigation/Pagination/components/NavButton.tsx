import { Button } from '@components/inputs'
import { Box, Flex } from '@components/primitives'

export function NavButton({
  direction,
  onClick,
  hidden
}: {
  direction: 'previous' | 'next'
  onClick: () => void
  hidden?: boolean
}): React.ReactElement {
  const icon = direction === 'previous' ? 'uil:angle-left' : 'uil:angle-right'

  const label = direction === 'previous' ? 'Previous' : 'Next'

  if (hidden) {
    return <Box width={{ base: '3em', sm: '8em' }} />
  }

  return (
    <>
      <Flex
        display={{
          base: 'none',
          sm: 'flex'
        }}
        width="9em"
      >
        <Button
          icon={icon}
          iconPosition={direction === 'next' ? 'end' : undefined}
          variant="plain"
          onClick={onClick}
        >
          {label}
        </Button>
      </Flex>
      <Flex
        display={{
          base: 'flex',
          sm: 'none'
        }}
        width="3em"
      >
        <Button
          icon={icon}
          iconPosition={direction === 'next' ? 'end' : undefined}
          variant="plain"
          onClick={onClick}
        />
      </Flex>
    </>
  )
}
