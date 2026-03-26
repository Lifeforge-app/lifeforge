import { Flex } from '@components/primitives'

function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  return (
    <Flex flex="1" gap={{ base: 'none', lg: 'lg' }} minHeight="0" width="100%">
      {children}
    </Flex>
  )
}

export default LayoutWithSidebar
