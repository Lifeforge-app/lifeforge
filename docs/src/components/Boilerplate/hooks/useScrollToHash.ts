import { useEffect } from 'react'
import { useLocation } from 'react-router'

function useScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash

    if (hash) {
      const element = document.getElementById(hash.slice(1))

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      document
        .querySelector('section')
        ?.parentElement?.parentElement?.scrollTo(0, 0)
    }
  }, [location])
}

export default useScrollToHash
