import { type IRoutes } from '@typedec/Routes'

export const ROUTES: IRoutes[] = [
  {
    title: '',
    items: [
      {
        name: 'Dashboard',
        icon: 'tabler:dashboard',
        routes: { dashboard: 'dashboard' },
        togglable: false
      }
    ]
  },
  {
    title: 'Productivity',
    items: [
      {
        name: 'Projects (M)',
        icon: 'tabler:clipboard',
        routes: {
          'projects-m': 'projects-m',
          'projects-m-id': 'projects-m/:id'
        },
        togglable: true
      },
      {
        name: 'Projects (K)',
        icon: 'tabler:clipboard',
        routes: {
          'projects-k': 'projects-k',
          'projects-k-id': 'projects-k/:id'
        },
        togglable: true
      },
      {
        name: 'Idea Box',
        icon: 'tabler:bulb',
        routes: { 'idea-box': 'idea-box', 'idea-box-id': 'idea-box/:id' },
        togglable: true
      },
      {
        name: 'Todo List',
        icon: 'tabler:list-check',
        routes: { 'todo-list': 'todo-list' },
        togglable: true
      },
      {
        name: 'Calendar',
        icon: 'tabler:calendar',
        routes: { calendar: 'calendar' },
        togglable: true
      },
      {
        name: 'Spotify',
        icon: 'tabler:brand-spotify',
        routes: { spotify: 'spotify' },
        togglable: true
      },
      {
        name: 'Code Time',
        icon: 'tabler:code',
        routes: { 'code-time': 'code-time' },
        togglable: true
      }
    ]
  },
  {
    title: 'Storage',
    items: [
      {
        name: 'Photos',
        icon: 'tabler:camera',
        provider: 'photos-provider',
        routes: {
          'photos-main-gallery': '',
          'photos-album-list': 'album',
          'photos-album-gallery/:id': 'album/:id',
          'photos-album-favourites': 'favourites'
        },
        togglable: true
      },
      {
        name: 'Music',
        icon: 'tabler:music',
        routes: { music: 'music' },
        togglable: true
      },
      {
        name: 'Repositories',
        icon: 'tabler:git-branch',
        routes: { repositories: 'repositories' },
        togglable: true
      }
    ]
  },
  {
    title: 'Study',
    items: [
      {
        name: 'Pomodoro Timer',
        icon: 'tabler:clock-bolt',
        routes: { 'pomodoro-timer': 'pomodoro-timer' },
        togglable: true
      },
      {
        name: 'Flashcards',
        icon: 'tabler:cards',
        routes: { flashcards: 'flashcards', 'flashcards-id': 'flashcardsid' },
        togglable: true
      },
      {
        name: 'Notes',
        icon: 'tabler:notebook',
        routes: {
          notes: 'notes',
          'notes-workspace': 'notes/:workspace',
          'notes-file': 'notes/:workspace/:subject/file/:id',
          'notes-subject': 'notes/:workspace/:subject/*'
        },
        togglable: true
      },
      {
        name: 'Books Library',
        icon: 'tabler:books',
        routes: { 'books-library': 'books-library' },
        togglable: true
      }
    ]
  },
  {
    title: 'Finance',
    items: [
      {
        name: 'Wallet',
        icon: 'tabler:currency-dollar',
        subsection: [
          ['Balance', 'tabler:wallet'],
          ['Transactions', 'tabler:arrows-exchange'],
          ['Budgets', 'tabler:coin'],
          ['Reports', 'tabler:chart-bar']
        ],
        routes: {},
        togglable: true
      },
      {
        name: 'Wish List',
        icon: 'tabler:heart',
        routes: {},
        togglable: true
      }
    ]
  },
  {
    title: 'Confidential',
    items: [
      {
        name: 'Contacts',
        icon: 'tabler:users',
        routes: {},
        togglable: true
      },
      {
        name: 'Passwords',
        icon: 'tabler:key',
        routes: { passwords: 'passwords' },
        togglable: true
      },
      {
        name: 'Journal',
        icon: 'tabler:book',
        routes: {
          journal: 'journal',
          'journal-view': 'journal/view/:id',
          'journal-edit': 'journal/edit/:id'
        },
        togglable: true
      }
    ]
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'Personalization',
        icon: 'tabler:palette',
        routes: { personalization: 'personalization' },
        togglable: false
      },
      {
        name: 'Modules',
        icon: 'tabler:plug',
        routes: { modules: 'modules' },
        togglable: false
      },
      {
        name: 'Data Backup',
        icon: 'tabler:database',
        routes: { 'data-backup': 'data-backup' },
        togglable: false
      },
      {
        name: 'Server Status',
        icon: 'tabler:server',
        routes: { 'server-status': 'server-status' },
        togglable: false
      }
    ]
  },
  {
    title: '',
    items: [
      {
        name: 'Change Log',
        icon: 'tabler:file-text',
        routes: { 'change-log': 'change-log' },
        togglable: false
      },
      {
        name: 'about',
        icon: 'tabler:info-circle',
        routes: { about: 'about' },
        togglable: false
      }
    ]
  }
]
