import _ from 'lodash'

import { Text, Transition } from '@lifeforge/ui'

import { sectionLink } from '../Rightbar.css'
import { useActiveSection } from '../contexts/ActiveSectionProvider'

function SectionItem({ item }: { item: string }) {
  const { activeSection, handleSectionClick } = useActiveSection()

  const itemId = _.kebabCase(item.replace(/\./g, ''))

  return (
    <Transition>
      <Text
        aria-current={activeSection === itemId ? 'page' : undefined}
        as="a"
        className={sectionLink}
        color={{
          base: 'bg-600',
          dark: 'bg-400',
          hover: 'bg-800',
          darkHover: 'bg-100'
        }}
        display="block"
        href={`#${itemId}`}
        id={itemId}
        position="relative"
        px="md"
        py="sm"
        onClick={e => {
          e.preventDefault()
          handleSectionClick(itemId)
        }}
      >
        {item}
      </Text>
    </Transition>
  )
}

export default SectionItem
