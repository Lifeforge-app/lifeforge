export const FONT_SCALE_TOOLBAR_CONFIG = {
  name: 'Font Scale',
  description: 'Font scale',
  defaultValue: '1',
  toolbar: {
    icon: 'grow' as const,
    items: [
      { value: '0.8', title: '🤏 Small' },
      { value: '1', title: '👥 Medium' },
      { value: '2', title: '👥👥 Large' },
      { value: '3', title: '👥👥👥 Extra Large' }
    ],
    showName: true,
    dynamicTitle: true
  }
}
