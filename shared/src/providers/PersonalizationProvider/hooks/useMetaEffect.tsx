import { useEffect } from 'react'

function useMetaEffect(themeColor: string) {
  useEffect(() => {
    const favIcon = document.querySelector(
      "meta[name='ori-icon']"
    ) as HTMLMetaElement | null

    let targetSVGString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="${themeColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m11.414 10l-7.383 7.418a2.09 2.09 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0L14.414 13m3.707 2.293l2.586-2.586a1 1 0 0 0 0-1.414l-7.586-7.586a1 1 0 0 0-1.414 0L9.121 6.293a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0"/></svg>`

    if (favIcon) {
      targetSVGString = atob(favIcon.content.split(',')[1] || '').replace(
        'currentColor',
        themeColor
      )
    }

    const existingFavicons = document.querySelectorAll("link[rel*='icon']")

    existingFavicons.forEach(icon => icon.remove())

    const newFavIcon = document.createElement('link')

    newFavIcon.rel = 'icon'
    newFavIcon.type = 'image/svg+xml'
    newFavIcon.href = `data:image/svg+xml;base64,${btoa(targetSVGString)}`
    document.head.appendChild(newFavIcon)

    const themeMeta = document.querySelector(
      "meta[name='theme-color']"
    ) as HTMLMetaElement

    if (themeMeta) {
      themeMeta.content = themeColor
    } else {
      const newThemeMeta = document.createElement('meta')

      newThemeMeta.name = 'theme-color'
      newThemeMeta.content = themeColor
      document.head.appendChild(newThemeMeta)
    }
  }, [themeColor])
}

export default useMetaEffect
