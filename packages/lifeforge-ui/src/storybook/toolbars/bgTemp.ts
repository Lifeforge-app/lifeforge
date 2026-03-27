const BG_TEMP_TOOLBAR_CONFIG = {
  name: 'BG Temp',
  description: 'Background color temperature',
  defaultValue: 'bg-zinc',
  toolbar: {
    icon: 'contrast',
    items: [
      { value: 'bg-slate', title: '🪨 Slate' },
      { value: 'bg-gray', title: '🩶 Gray' },
      { value: 'bg-zinc', title: '⚙️ Zinc' },
      { value: 'bg-neutral', title: '⬜ Neutral' },
      { value: 'bg-stone', title: '🪵 Stone' }
    ],
    showName: true,
    dynamicTitle: true
  }
}

export default BG_TEMP_TOOLBAR_CONFIG
