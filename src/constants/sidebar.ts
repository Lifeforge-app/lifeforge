interface ISidebarItem {
  type: 'item' | 'title' | 'divider'
  name?: string
  icon?: string
  subsection?: string[][]
}

const SIDEBAR_ITEMS: ISidebarItem[] = [
  { type: 'item', name: 'Dashboard', icon: 'tabler:layout-dashboard' },
  { type: 'divider' },
  { type: 'title', name: 'Productivity' },
  { type: 'item', name: 'Todo List', icon: 'tabler:list-check' },
  { type: 'item', name: 'Calendar', icon: 'tabler:calendar' },
  { type: 'divider' },
  { type: 'title', name: 'Development' },
  {
    type: 'item',
    name: 'Projects',
    icon: 'tabler:clipboard'
  },
  { type: 'item', name: 'Idea Box', icon: 'tabler:bulb' },
  { type: 'item', name: 'Snippets', icon: 'tabler:code-dots' },
  { type: 'item', name: 'Resources', icon: 'tabler:book' },
  { type: 'item', name: 'Code Time', icon: 'tabler:code' },
  { type: 'divider' },
  { type: 'title', name: 'Study' },
  { type: 'item', name: 'Pomodoro Timer', icon: 'tabler:clock-bolt' },
  { type: 'item', name: 'Flashcards', icon: 'tabler:cards' },
  {
    type: 'item',
    name: 'Notes',
    icon: 'tabler:notebook'
  },
  {
    type: 'item',
    name: 'Reference Books',
    icon: 'tabler:books',
    subsection: [
      ['Mathematics', 'tabler:calculator'],
      ['Physics', 'tabler:atom']
    ]
  },
  { type: 'divider' },
  { type: 'title', name: 'Lifestyle' },
  { type: 'item', name: 'Blog', icon: 'tabler:file-text' },
  {
    type: 'item',
    name: 'Travel',
    icon: 'tabler:plane',
    subsection: [
      ['Places', 'tabler:map-2'],
      ['Trips', 'tabler:map-pin'],
      ['Photos', 'tabler:photo']
    ]
  },
  { type: 'item', name: 'Achievements', icon: 'tabler:award' },
  { type: 'item', name: 'Memory Archive', icon: 'tabler:archive' },
  { type: 'divider' },
  { type: 'title', name: 'Finance' },
  {
    type: 'item',
    name: 'Wallet',
    icon: 'tabler:currency-dollar',
    subsection: [
      ['Balance', 'tabler:wallet'],
      ['Transactions', 'tabler:arrows-exchange'],
      ['Budgets', 'tabler:coin'],
      ['Reports', 'tabler:chart-bar']
    ]
  },
  { type: 'item', name: 'Wish List', icon: 'tabler:heart' },
  { type: 'divider' },
  { type: 'title', name: 'Confidential' },
  { type: 'item', name: 'Contacts', icon: 'tabler:users' },
  { type: 'item', name: 'Passwords', icon: 'tabler:key' },
  { type: 'divider' },
  { type: 'title', name: 'storage' },
  { type: 'item', name: 'Documents', icon: 'tabler:file' },
  { type: 'item', name: 'Images', icon: 'tabler:photo' },
  { type: 'item', name: 'Videos', icon: 'tabler:video' },
  { type: 'item', name: 'Musics', icon: 'tabler:music' },
  { type: 'divider' },
  { type: 'title', name: 'Settings' },
  { type: 'item', name: 'Settings', icon: 'tabler:settings' },
  { type: 'item', name: 'Plugins', icon: 'tabler:plug' },
  { type: 'item', name: 'Personalization', icon: 'tabler:palette' },
  { type: 'item', name: 'Server Status', icon: 'tabler:server' },
  { type: 'divider' },
  { type: 'item', name: 'About', icon: 'tabler:info-circle' },
  { type: 'item', name: 'Change Log', icon: 'tabler:file-text' }
]

export default SIDEBAR_ITEMS
