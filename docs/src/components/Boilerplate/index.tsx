import { Bordered, Box, Flex, Scrollbar } from '@lifeforge/ui'

import FooterSection from './components/FooterSection'
import NavigationBar from './components/NavigationBar'
import useScrollToHash from './hooks/useScrollToHash'

function Boilerplate({ children }: { children: React.ReactNode }) {
  useScrollToHash()

  return (
    <Box as="article" flex="1" height="100%" minHeight="0" position="relative">
      <Scrollbar>
        <Flex
          direction="column"
          flex="1"
          minWidth="0"
          pb="none"
          pt={{ base: 'lg', lg: '2xl' }}
          px={{ base: 'lg', lg: '2xl' }}
          width="100%"
        >
          {children}
          <NavigationBar />
          <Bordered
            borderColor={{ base: 'bg-200', dark: 'bg-800' }}
            borderSide="top"
            borderWidth="1.5px"
            my="2xl"
          />
          <FooterSection />
        </Flex>
      </Scrollbar>
    </Box>
  )
}

export default Boilerplate
