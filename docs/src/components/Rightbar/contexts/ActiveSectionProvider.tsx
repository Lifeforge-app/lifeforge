import _ from 'lodash'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useLocation } from 'react-router'

interface ActiveSectionContextValue {
  allSections: string[]
  activeSection: string
  handleSectionClick: (itemId: string) => void
}

const ActiveSectionContext = createContext<ActiveSectionContextValue | null>(
  null
)

export function ActiveSectionProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [allSections, setAllSections] = useState<string[]>([])

  const [activeSection, setActiveSection] = useState<string>('')

  const location = useLocation()

  const userClickedRef = useRef(false)

  const userClickTimeoutRef = useRef<number | null>(null)

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
        if (userClickedRef.current) return

        entries.forEach(entry => {
          const id = entry.target.id || ''

          const sanitizedId = _.kebabCase(id)

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
          section.id = _.kebabCase(heading.textContent.replace(/\./g, ''))
          observer.observe(section)
        }
      }
    })

    if (_allSections.length > 0) {
      const firstSectionId = _.kebabCase(_allSections[0].replace(/\./g, ''))

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

  const handleSectionClick = useCallback((itemId: string) => {
    setActiveSection(itemId)

    setTimeout(() => {
      const sectionElement = document.querySelector(`section#${itemId}`)

      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)

    userClickedRef.current = true

    if (userClickTimeoutRef.current) {
      window.clearTimeout(userClickTimeoutRef.current)
    }

    userClickTimeoutRef.current = window.setTimeout(() => {
      userClickedRef.current = false
    }, 1000)
  }, [])

  return (
    <ActiveSectionContext
      value={{ allSections, activeSection, handleSectionClick }}
    >
      {children}
    </ActiveSectionContext>
  )
}

export function useActiveSection() {
  const ctx = useContext(ActiveSectionContext)

  if (!ctx) {
    throw new Error(
      'useActiveSection must be used within an ActiveSectionProvider'
    )
  }

  return ctx
}
