import { Bordered, Text } from '@lifeforge/ui'

import SectionItem from '../components/SectionItem'
import { useActiveSection } from '../contexts/ActiveSectionProvider'

function OnThisPageSection() {
  const { allSections } = useActiveSection()

  return (
    <>
      <Text as="h2" size="lg" weight="semibold">
        On This Page
      </Text>
      <Bordered
        as="ul"
        borderColor={{
          base: 'bg-200',
          dark: 'bg-800'
        }}
        borderSide="left"
        borderWidth="1.5px"
        mt="md"
        position="relative"
        style={{
          isolation: 'isolate'
        }}
      >
        {allSections.map((item, index) => (
          <SectionItem key={`${item}-${index}`} item={item} />
        ))}
      </Bordered>
    </>
  )
}

export default OnThisPageSection
