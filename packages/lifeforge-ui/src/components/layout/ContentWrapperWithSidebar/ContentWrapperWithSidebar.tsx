import { Flex } from '@components/primitives'

function ContentWrapperWithSidebar({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Flex
      className="z-0"
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

export default ContentWrapperWithSidebar
