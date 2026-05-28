import { Flex } from '@/components/primitives'

export function ContentWrapperWithSidebar({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Flex
      direction="column"
      flex="1"
      height="100%"
      minWidth="0"
      position="relative"
      zIndex="0"
    >
      {children}
    </Flex>
  )
}
