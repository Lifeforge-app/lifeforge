const THEME_TOOLBAR_CONFIG = {
  name: 'Theme',
  description: 'Light / Dark mode',
  defaultValue: 'light',
  toolbar: {
    icon: 'circlehollow',
    items: [
      {
        value: 'light',
        title: 'Light Mode',
        icon: 'sun'
      },
      {
        value: 'dark',
        title: 'Dark Mode',
        icon: 'moon'
      }
    ],
    showName: true,
    dynamicTitle: true
  }
}

export default THEME_TOOLBAR_CONFIG
