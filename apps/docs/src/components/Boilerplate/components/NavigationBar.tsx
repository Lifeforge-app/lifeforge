import { Icon } from '@iconify/react/dist/iconify.js'
import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import SECTIONS from '../../../constants/Sections'
import { toLinkCase, toTitleCase } from '../../../utils/string'

function NavigationBar() {
  const location = useLocation()

  const currentGroup = useMemo(() => location.pathname.split[1], [location])

  const currentSection = useMemo(() => location.pathname.split[2], [location])

  const nextSection = useMemo(() => {
    const sectionLinkCase = Object.fromEntries(
      Object.entries(SECTIONS).map(([title, items]) => {
        return [toLinkCase(title), items.map(toLinkCase)]
      })
    )

    const currentGroupIndex = Object.keys(sectionLinkCase).indexOf(currentGroup)

    if (currentGroupIndex === -1) return null

    const currentSectionIndex =
      sectionLinkCase[currentGroup].indexOf(currentSection)

    if (currentSectionIndex === -1) return null

    if (currentSectionIndex === sectionLinkCase[currentGroup].length - 1) {
      if (currentGroupIndex === Object.keys(sectionLinkCase).length - 1) {
        return null
      }

      return {
        group: Object.keys(sectionLinkCase)[currentGroupIndex + 1],
        section:
          sectionLinkCase[
            Object.keys(sectionLinkCase)[currentGroupIndex + 1]
          ][0]
      }
    }

    return {
      group: currentGroup,
      section: sectionLinkCase[currentGroup][currentSectionIndex + 1]
    }
  }, [currentGroup, currentSection])

  const lastSection = useMemo(() => {
    const sectionLinkCase = Object.fromEntries(
      Object.entries(SECTIONS).map(([title, items]) => {
        return [toLinkCase(title), items.map(toLinkCase)]
      })
    )

    const currentGroupIndex = Object.keys(sectionLinkCase).indexOf(currentGroup)

    if (currentGroupIndex === -1) return null

    const currentSectionIndex =
      sectionLinkCase[currentGroup].indexOf(currentSection)

    if (currentSectionIndex === -1) return null

    if (currentSectionIndex === 0) {
      if (currentGroupIndex === 0) {
        return null
      }

      return {
        group: Object.keys(sectionLinkCase)[currentGroupIndex - 1],
        section:
          sectionLinkCase[Object.keys(sectionLinkCase)[currentGroupIndex - 1]][
            sectionLinkCase[Object.keys(sectionLinkCase)[currentGroupIndex - 1]]
              .length - 1
          ]
      }
    }

    return {
      group: currentGroup,
      section: sectionLinkCase[currentGroup][currentSectionIndex - 1]
    }
  }, [currentGroup, currentSection])

  return (
    <div className="mt-12 flex items-center justify-between">
      {lastSection ? (
        <Link
          className="text-bg-100 flex items-center gap-2 text-lg font-medium hover:underline"
          to={`/${lastSection.group}/${lastSection.section}`}
        >
          <Icon className="-mb-1 h-5 w-5 shrink-0" icon="tabler:arrow-left" />
          {toTitleCase(lastSection.section)}
        </Link>
      ) : (
        <span />
      )}
      {nextSection && (
        <Link
          className="text-bg-100 flex items-center gap-2 text-lg font-medium hover:underline"
          to={`/${nextSection.group}/${nextSection.section}`}
        >
          {toTitleCase(nextSection.section)}
          <Icon className="-mb-1 h-5 w-5 shrink-0" icon="tabler:arrow-right" />
        </Link>
      )}
    </div>
  )
}

export default NavigationBar
