const THEME_COLOR_TOOLBAR_CONFIG = {
  name: 'Theme Color',
  description: 'Primary theme color',
  defaultValue: '#4caf50',
  toolbar: {
    icon: 'paintbrush',
    items: [
      { value: '#f44336', title: '🔴 Red' },
      { value: '#e91e63', title: '🩷 Pink' },
      { value: '#9c27b0', title: '🟣 Purple' },
      { value: '#673ab7', title: '🔮 Deep Purple' },
      { value: '#3f51b5', title: '🔵 Indigo' },
      { value: '#2196f3', title: '🔷 Blue' },
      { value: '#03a9f4', title: '💧 Light Blue' },
      { value: '#00bcd4', title: '🥶 Cyan' },
      { value: '#009688', title: '🍵 Teal' },
      { value: '#4caf50', title: '🟢 Green' },
      { value: '#8bc34a', title: '🌱 Light Green' },
      { value: '#cddc39', title: '🍋 Lime' },
      { value: '#ffeb3b', title: '💛 Yellow' },
      { value: '#ffc107', title: '🟠 Amber' },
      { value: '#ff9800', title: '🟠 Orange' },
      { value: '#ff5722', title: '🦀 Deep Orange' },
      { value: '#795548', title: '🪵 Brown' },
      { value: '#9e9e9e', title: '🩶 Grey' },
      { value: 'custom', title: 'Custom Color...' }
    ],
    showName: true,
    dynamicTitle: true
  }
}

export default THEME_COLOR_TOOLBAR_CONFIG
