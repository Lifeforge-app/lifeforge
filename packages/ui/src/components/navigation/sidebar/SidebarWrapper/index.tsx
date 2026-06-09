import { useModuleSidebarState } from '../../../../providers'

import { Box, Flex } from '@/components/primitives'
import { Scrollbar } from '@/components/utilities'

import { GoBackButton } from '../../GoBackButton'

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, setIsSidebarOpen } = useModuleSidebarState()

  return (
    <Box
      shadow
      as="aside"
      bg={{ base: 'bg-50', dark: 'bg-900' }}
      className={isSidebarOpen ? 'sidebar-opening' : 'sidebar-closing'}
      flexShrink="0"
      height={{ base: '100%', xl: 'calc(100% - 2rem)' }}
      left={isSidebarOpen ? '0' : '100%'}
      minWidth={{ base: '0', xl: '24rem' }}
      position={{ base: 'absolute', xl: 'static' }}
      py="md"
      r="lg"
      top="0"
      width={{ base: '100%', xl: '25%' }}
      zIndex={isSidebarOpen ? '9990' : '0'}
    >
      <Scrollbar usePaddingRight={false}>
        <Flex
          align="center"
          display={{ base: 'flex', xl: 'none' }}
          justify="between"
          px="2xl"
          py="md"
        >
          <GoBackButton onClick={() => setIsSidebarOpen(false)} />
        </Flex>
        <Flex
          as="ul"
          direction="column"
          height="100%"
          minWidth="0"
          style={{ gap: '0.125rem' }}
          width="100%"
        >
          {children}
        </Flex>
      </Scrollbar>
    </Box>
  )
}
