import { useMemo } from 'react'

import { useFederation, usePersonalization } from '@lifeforge/shared'
import { SidebarTitle } from '@lifeforge/ui'

function MainSidebarTitle({ title }: { title: string }) {
  const { categoryTranslations } = useFederation()

  const { language } = usePersonalization()

  const translatedTitle = useMemo(() => {
    const key = title.toLowerCase()

    const translations = categoryTranslations[key]

    if (translations && translations[language]) {
      return translations[language]
    }

    return title
  }, [categoryTranslations, language])

  return <SidebarTitle label={translatedTitle} />
}

export default MainSidebarTitle
