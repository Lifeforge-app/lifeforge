export const THEME_TOOLBAR_CONFIG = {
  name: 'Theme',
  description: 'Light / Dark mode',
  defaultValue: 'light',
  toolbar: {
    icon: 'circlehollow' as const,
    items: [
      {
        value: 'light',
        title: 'Light Mode',
        icon: 'sun' as const
      },
      {
        value: 'dark',
        title: 'Dark Mode',
        icon: 'moon' as const
      }
    ],
    showName: true,
    dynamicTitle: true
  }
}
