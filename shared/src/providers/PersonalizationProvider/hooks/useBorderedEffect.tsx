import { useEffect } from 'react'

function useBorderedEffect(rootElement: HTMLElement, bordered: boolean) {
  useEffect(() => {
    if (bordered) {
      rootElement.classList.add('bordered')
    } else {
      rootElement.classList.remove('bordered')
    }
  }, [bordered, rootElement])
}

export default useBorderedEffect
