const FONT_SCALE_TOOLBAR_CONFIG = {
  name: 'Font Scale',
  description: 'Font scale',
  defaultValue: 1,
  toolbar: {
    icon: 'grow',
    items: [
      { value: 0.5, title: '🤏 Small' },
      { value: 1, title: '👥 Medium' },
      { value: 2, title: '👥👥 Large' },
      { value: 3, title: '👥👥👥 Extra Large' }
    ],
    showName: true,
    dynamicTitle: true
  }
}

export default FONT_SCALE_TOOLBAR_CONFIG
