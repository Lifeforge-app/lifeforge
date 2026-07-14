export const i18nConfig = {
  lng: 'en',
  cache: {
    enabled: true
  },
  initImmediate: true,
  maxRetries: 1,
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded'
  },
  cleanCode: true,
  debug: false,
  interpolation: {
    escapeValue: false
  },
  ns: ['common'],
  returnedObjectHandler: (key: string, value: string, options: any) => {
    return JSON.stringify({ key, value, options })
  },
  backend: {
    loadPath: (langs: string[], namespaces: string[]) => {
      const namespace = namespaces[0]?.split('.')[0]

      if (!namespace) return

      const lang = langs.find(l => l !== 'dev')

      if (!lang) return

      return `https://raw.githubusercontent.com/Lifeforge-app/lifeforge/main/locales/lang-${lang}/${namespace}.json`
    }
  }
}
