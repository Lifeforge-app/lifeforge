import { useLocation } from 'react-router'

import { Box, Scrollbar } from '@lifeforge/ui'

import { ActiveSectionProvider } from './contexts/ActiveSectionProvider'
import BottomLinkSection from './sections/BottomLinkSection'
import OnThisPageSection from './sections/OnThisPageSection'

export const BLACKLISTED_PAGES = ['/progress/changelog']

function Rightbar() {
  const location = useLocation()

  if (BLACKLISTED_PAGES.some(page => location.pathname.startsWith(page))) {
    return null
  }

  return (
    <ActiveSectionProvider>
      <Box display={{ base: 'none', lg: 'block' }} p="2xl" width="20em">
        <Scrollbar>
          <OnThisPageSection />
          <BottomLinkSection />
        </Scrollbar>
      </Box>
    </ActiveSectionProvider>
  )
}

export default Rightbar
