import { Flex } from '@lifeforge/ui'

import NavigationLink from './NavigationLink'
import useNavigation from '../hooks/useNavigation'

function NavigationBar() {
  const { nextSection, lastSection } = useNavigation()

  return (
    <Flex align="center" justify="between" mt="2xl">
      <NavigationLink direction="previous" section={lastSection} />
      <NavigationLink direction="next" section={nextSection} />
    </Flex>
  )
}

export default NavigationBar
