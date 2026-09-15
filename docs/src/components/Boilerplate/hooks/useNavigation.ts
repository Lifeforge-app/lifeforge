import _ from 'lodash'
import { useMemo } from 'react'
import { useLocation } from 'react-router'

import ROUTES from '../../../Router'

function buildSectionLinkCase() {
  return Object.fromEntries(
    ROUTES.map(({ path, children }) => [
      _.kebabCase(path),
      children!.map(({ path }) => _.kebabCase(path))
    ])
  )
}

function useNavigation() {
  const location = useLocation()

  const currentGroup = useMemo(
    () => location.pathname.split('/')[1],
    [location]
  )

  const currentSection = useMemo(
    () => location.pathname.split('/')[2],
    [location]
  )

  const nextSection = useMemo(() => {
    const sectionLinkCase = buildSectionLinkCase()

    const groupKeys = Object.keys(sectionLinkCase)

    const currentGroupIndex = groupKeys.indexOf(currentGroup)

    if (currentGroupIndex === -1) return null

    const sections = sectionLinkCase[currentGroup]

    const currentSectionIndex = sections.indexOf(currentSection)

    if (currentSectionIndex === -1) return null

    if (currentSectionIndex === sections.length - 1) {
      if (currentGroupIndex === groupKeys.length - 1) return null

      return {
        group: groupKeys[currentGroupIndex + 1],
        section: sectionLinkCase[groupKeys[currentGroupIndex + 1]][0]
      }
    }

    return {
      group: currentGroup,
      section: sections[currentSectionIndex + 1]
    }
  }, [currentGroup, currentSection])

  const lastSection = useMemo(() => {
    const sectionLinkCase = buildSectionLinkCase()

    const groupKeys = Object.keys(sectionLinkCase)

    const currentGroupIndex = groupKeys.indexOf(currentGroup)

    if (currentGroupIndex === -1) return null

    const sections = sectionLinkCase[currentGroup]

    const currentSectionIndex = sections.indexOf(currentSection)

    if (currentSectionIndex === -1) return null

    if (currentSectionIndex === 0) {
      if (currentGroupIndex === 0) return null

      return {
        group: groupKeys[currentGroupIndex - 1],
        section:
          sectionLinkCase[groupKeys[currentGroupIndex - 1]][
            sectionLinkCase[groupKeys[currentGroupIndex - 1]].length - 1
          ]
      }
    }

    return {
      group: currentGroup,
      section: sections[currentSectionIndex - 1]
    }
  }, [currentGroup, currentSection])

  return { nextSection, lastSection }
}

export default useNavigation
