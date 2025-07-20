import { useEffect } from 'react'

function useFaviconEffect(themeColor: string) {
  useEffect(() => {
    const targetSVGString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="${themeColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 13L7 11.5l5.5 5.5l-1.5 1.5c-.75.75-3.5 2-5.5 0s-.75-4.75 0-5.5M3 21l2.5-2.5m13-7.5L17 12.5L11.5 7L13 5.5c.75-.75 3.5-2 5.5 0s.75 4.75 0 5.5m-6-3l-2 2M21 3l-2.5 2.5m-2.5 6l-2 2"/></svg>`

    const favicon = document.querySelector(
      "link[rel*='icon']"
    ) as HTMLLinkElement
    if (favicon) {
      favicon.href = `data:image/svg+xml;base64,${btoa(targetSVGString)}`
    }
  }, [themeColor])
}

export default useFaviconEffect
