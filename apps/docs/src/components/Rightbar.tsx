import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { toLinkCase, toTitleCase } from '../utils/string'

function Rightbar() {
  const [allSections, setAllSections] = useState<string[]>([])

  const [activeSection, setActiveSection] = useState<string>('')

  const location = useLocation()

  const userClickedRef = useRef(false)

  const userClickTimeoutRef = useRef<number | null>(null)

  // Apply aria-current attribute whenever activeSection changes
  useEffect(() => {
    if (activeSection) {
      document.querySelectorAll('li[aria-current=page]').forEach(li => {
        li.removeAttribute('aria-current')
      })

      const activeLink = document.querySelector(`li a#${activeSection}`)

      if (activeLink?.parentElement) {
        activeLink.parentElement.setAttribute('aria-current', 'page')
      }
    }
  }, [activeSection])

  useEffect(() => {
    const sections = document.querySelectorAll('article section')

    const _allSections: string[] = []

    sections.forEach(heading => {
      _allSections.push(heading.querySelector('h2,h6')?.textContent || '')
    })
    setAllSections(_allSections)

    setActiveSection('')

    const sectionIntersectionRatios = new Map<string, number>()

    const observer = new IntersectionObserver(
      entries => {
        // Don't update if the user just clicked a link
        if (userClickedRef.current) return

        entries.forEach(entry => {
          const id = entry.target.id || ''

          const sanitizedId = toLinkCase(id)

          sectionIntersectionRatios.set(sanitizedId, entry.intersectionRatio)
        })

        let highestRatio = 0
        let mostVisibleSection = ''

        sectionIntersectionRatios.forEach((ratio, id) => {
          if (ratio > highestRatio) {
            highestRatio = ratio
            mostVisibleSection = id
          }
        })

        if (mostVisibleSection && mostVisibleSection !== activeSection) {
          setActiveSection(mostVisibleSection)
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '-10% 0px -70% 0px'
      }
    )

    sections.forEach(section => {
      if (section.id) {
        observer.observe(section)
      } else {
        const heading = section.querySelector('h2,h6')

        if (heading && heading.textContent) {
          section.id = toLinkCase(heading.textContent.replace(/\./g, ''))
          observer.observe(section)
        }
      }
    })

    // Set the first section as active after processing all sections
    if (_allSections.length > 0) {
      const firstSectionId = toLinkCase(_allSections[0].replace(/\./g, ''))

      setActiveSection(firstSectionId)
    }

    return () => {
      document.querySelectorAll('li[aria-current=page]').forEach(li => {
        li.removeAttribute('aria-current')
      })
      observer.disconnect()

      if (userClickTimeoutRef.current) {
        window.clearTimeout(userClickTimeoutRef.current)
      }
    }
  }, [location])

  const handleSectionClick = (itemId: string) => {
    // Set active section immediately
    setActiveSection(itemId)

    // Manually scroll to the section
    setTimeout(() => {
      const sectionElement = document.getElementById(itemId)

      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)

    // Temporarily disable the intersection observer's effect
    userClickedRef.current = true

    // Clear any existing timeout
    if (userClickTimeoutRef.current) {
      window.clearTimeout(userClickTimeoutRef.current)
    }

    // Re-enable the intersection observer after a delay
    userClickTimeoutRef.current = window.setTimeout(() => {
      userClickedRef.current = false
    }, 1000) // 1 second delay to allow scroll to finish
  }

  return (
    <aside className="fixed top-20 right-0 hidden h-full min-h-0 w-80 overflow-y-auto p-12 lg:block">
      <h2 className="text-lg font-semibold">On This Page</h2>
      <ul className="before:border-bg-200 dark:before:border-bg-800 relative isolate mt-4 before:absolute before:top-0 before:left-0 before:z-[-1] before:h-full before:border-r-[1.5px]">
        {allSections.map((item, index) => {
          const itemId = toLinkCase(item.replace(/\./g, ''))

          return (
            <a
              key={index}
              aria-current={activeSection === itemId ? 'page' : undefined}
              className="aria-[current=page]:text-custom-500! aria-[current=page]:border-custom-500 text-bg-600 dark:text-bg-400 hover:text-bg-800 dark:hover:text-bg-100 block cursor-pointer px-4 py-2 hover:font-medium aria-[current=page]:border-l-[2.5px] aria-[current=page]:font-semibold"
              href={`#${itemId}`}
              id={itemId}
              onClick={e => {
                e.preventDefault() // Prevent default anchor behavior
                handleSectionClick(itemId)
              }}
            >
              {item}
            </a>
          )
        })}
      </ul>
      <a
        className="text-bg-100 mt-6 flex items-center gap-2 font-medium hover:underline"
        href={`https://github.com/Lifeforge-app/lifeforge/edit/main/apps/docs/src/contents/${
          location.pathname.split('/')?.[1]
        }/${toTitleCase(
          location.pathname.split('/')?.[2]?.replace(/-/g, ' ') || ''
        )}.mdx`}
        rel="noreferrer"
        target="_blank"
      >
        Edit this page
        <Icon className="-mb-1 h-5 w-5" icon="tabler:arrow-up-right" />
      </a>
      <a
        className="text-bg-100 mt-4 flex items-center gap-2 font-medium hover:underline"
        href="https://github.com/Lifeforge-app/lifeforge/issues/new"
        rel="noreferrer"
        target="_blank"
      >
        Issue Report
        <Icon className="-mb-1 h-5 w-5" icon="tabler:arrow-up-right" />
      </a>
      <a
        className="text-bg-100 mt-4 flex items-center gap-2 font-medium hover:underline"
        href="https://github.com/Lifeforge-app/lifeforge"
        rel="noreferrer"
        target="_blank"
      >
        Star on GitHub
        <Icon className="-mb-1 h-5 w-5" icon="tabler:arrow-up-right" />
      </a>
    </aside>
  )
}

export default Rightbar
