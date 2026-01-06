export interface Module {
  id: string
  name: string
  description: string
  icon: string
  author: string
  category: string
  stars: number
  downloads: number
  version: string
  updatedAt: string
}

export const MODULES: Module[] = [
  {
    id: 'lifeforge--todo-list',
    name: 'Todo List',
    description:
      'Never forget your tasks again. simple, effective, and works offline.',
    icon: 'tabler:list-check',
    author: 'LifeForge',
    category: 'Productivity',
    stars: 1240,
    downloads: 5400,
    version: '1.2.0',
    updatedAt: '2 days ago'
  },
  {
    id: 'lifeforge--pomodoro-timer',
    name: 'Pomodoro Timer',
    description:
      'Boost your productivity with the Pomodoro technique. Customizable timers and notifications.',
    icon: 'tabler:clock',
    author: 'LifeForge',
    category: 'Productivity',
    stars: 890,
    downloads: 3200,
    version: '1.0.5',
    updatedAt: '1 week ago'
  },
  {
    id: 'melvinchia3636--invoice-maker',
    name: 'Invoice Maker',
    description:
      'Create professional invoices in seconds. Export to PDF and track payments.',
    icon: 'tabler:file-invoice',
    author: 'melvinchia3636',
    category: 'Business',
    stars: 450,
    downloads: 1200,
    version: '0.9.2',
    updatedAt: '3 weeks ago'
  },
  {
    id: 'lifeforge--currency-converter',
    name: 'Currency Converter',
    description:
      'Real-time currency conversion with support for over 150 currencies.',
    icon: 'tabler:currency-dollar',
    author: 'LifeForge',
    category: 'Finance',
    stars: 670,
    downloads: 2800,
    version: '2.1.0',
    updatedAt: '1 month ago'
  },
  {
    id: 'lifeforge--music',
    name: 'Music Player',
    description:
      'A beautiful music player for your local library. Supports all major formats.',
    icon: 'tabler:music',
    author: 'LifeForge',
    category: 'Media',
    stars: 1500,
    downloads: 8900,
    version: '3.0.0',
    updatedAt: '5 days ago'
  },
  {
    id: 'melvinchia3636--modrinth',
    name: 'Modrinth Explorer',
    description: 'Browse and install Minecraft mods directly from Modrinth.',
    icon: 'tabler:box',
    author: 'melvinchia3636',
    category: 'Games',
    stars: 320,
    downloads: 900,
    version: '0.5.0',
    updatedAt: '2 months ago'
  }
]

export const CATEGORIES_CONFIG = [
  {
    name: 'Productivity',
    icon: 'tabler:list-check',
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    name: 'Finance',
    icon: 'tabler:chart-arrows-vertical',
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    name: 'Business',
    icon: 'tabler:briefcase',
    color: 'text-purple-500 bg-purple-500/10'
  },
  {
    name: 'Media',
    icon: 'tabler:music',
    color: 'text-pink-500 bg-pink-500/10'
  },
  {
    name: 'Games',
    icon: 'tabler:device-gamepad-2',
    color: 'text-red-500 bg-red-500/10'
  },
  {
    name: 'Utilities',
    icon: 'tabler:tool',
    color: 'text-amber-500 bg-amber-500/10'
  }
]

export const CATEGORIES = [
  'All',
  'Productivity',
  'Business',
  'Finance',
  'Media',
  'Games',
  'Utilities',
  'Development'
]
