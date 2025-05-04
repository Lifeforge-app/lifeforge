import {
  IconArrowsExchange,
  IconAward,
  IconBook,
  IconBooks,
  IconBulb,
  IconCalendar,
  IconCode,
  IconCurrencyDollar,
  IconDashboard,
  IconFileText,
  IconHeart,
  IconHistory,
  IconInfoCircle,
  IconKey,
  IconLayout,
  IconListCheck,
  IconMovie,
  IconMusic,
  IconPalette,
  IconPassword,
  IconPlug,
  IconServer,
  IconShirt,
  IconUserCog,
  IconWallet
} from '@tabler/icons-react'
import { lazy } from 'react'
import { Navigate } from 'react-router'

import { RouteCategory } from './layout/interfaces/routes_interfaces'

export const ROUTES: RouteCategory[] = [
  {
    title: '',
    items: [
      {
        name: 'Dashboard',
        icon: <IconDashboard />,
        routes: {
          dashboard: lazy(() => import('./pages/Dashboard'))
        },
        togglable: false
      }
    ]
  },
  {
    title: 'Productivity',
    items: [
      {
        name: 'Idea Box',
        provider: lazy(() => import('@apps/IdeaBox/providers/IdeaBoxProvider')),
        icon: <IconBulb />,
        routes: {
          '': lazy(() => import('@apps/IdeaBox/pages/Containers')),
          ':id/*': lazy(() => import('@apps/IdeaBox/pages/Ideas'))
        },
        togglable: true
      },
      {
        name: 'Todo List',
        icon: <IconListCheck />,
        routes: {
          'todo-list': lazy(() => import('@apps/TodoList'))
        },
        togglable: true,
        hasAI: true,
        requiredAPIKeys: ['groq']
      },
      {
        name: 'Calendar',
        icon: <IconCalendar />,
        routes: {
          calendar: lazy(() => import('@apps/Calendar'))
        },
        togglable: true
      },
      {
        name: 'Code Time',
        icon: <IconCode />,
        routes: {
          'code-time': lazy(() => import('@apps/CodeTime'))
        },
        togglable: true
      }
    ]
  },
  {
    title: 'Study',
    items: []
  },
  {
    title: 'Lifestyle',
    items: [
      {
        name: 'Moment Vault',
        icon: <IconHistory />,
        hasAI: true,
        routes: {
          'moment-vault': lazy(() => import('@apps/MomentVault'))
        },
        togglable: true,
        requiredAPIKeys: ['openai']
      },
      {
        name: 'Achievements',
        icon: <IconAward />,
        routes: {
          achievements: lazy(() => import('@apps/Achievements'))
        },
        togglable: true
      },
      {
        name: 'Virtual Wardrobe',
        icon: <IconShirt />,
        subsection: [
          {
            name: 'Virtual Wardrobe Clothes',
            icon: <IconShirt />,
            path: 'clothes'
          },
          {
            name: 'Virtual Wardrobe Outfits',
            icon: <IconLayout />,
            path: 'outfits'
          }
        ],
        routes: {
          'virtual-wardrobe': () => <Navigate to="/virtual-wardrobe/clothes" />,
          'virtual-wardrobe/clothes': lazy(
            () => import('@apps/VirtualWardrobe/pages/Clothes')
          ),
          'virtual-wardrobe/outfits': lazy(
            () => import('@apps/VirtualWardrobe/pages/Outfits')
          )
        },
        togglable: true
      },
      {
        name: 'Movies',
        icon: <IconMovie />,
        routes: {
          movies: lazy(() => import('@apps/Movies'))
        },
        togglable: true,
        requiredAPIKeys: ['tmdb']
      }
    ]
  },
  {
    title: 'Finance',
    items: [
      {
        name: 'Wallet',
        icon: <IconCurrencyDollar />,
        hasAI: true,
        subsection: [
          { name: 'Dashboard', icon: <IconDashboard />, path: '' },
          {
            name: 'Transactions',
            icon: <IconArrowsExchange />,
            path: 'transactions'
          },
          { name: 'Assets', icon: <IconWallet />, path: 'assets' },
          { name: 'Ledgers', icon: <IconBook />, path: 'ledgers' },
          {
            name: 'Financial Statements',
            icon: <IconFileText />,
            path: 'statements'
          }
        ],
        routes: {
          wallet: lazy(() => import('@apps/Wallet/pages/Dashboard')),
          'wallet/transactions': lazy(
            () => import('@apps/Wallet/pages/Transactions')
          ),
          'wallet/assets': lazy(() => import('@apps/Wallet/pages/Assets')),
          'wallet/ledgers': lazy(() => import('@apps/Wallet/pages/Ledgers')),
          'wallet/statements': lazy(
            () => import('@apps/Wallet/pages/Statements')
          )
        },
        togglable: true
      },
      {
        name: 'Wishlist',
        icon: <IconHeart />,
        routes: {
          wishlist: lazy(() => import('@apps/Wishlist/pages/WishlistList')),
          'wishlist/:id': lazy(
            () => import('@apps/Wishlist/pages/WishlistEntries')
          )
        },
        togglable: true,
        hasAI: true
      }
    ]
  },
  {
    title: 'Storage',
    items: [
      {
        name: 'Books Library',
        icon: <IconBooks />,
        provider: lazy(
          () => import('@apps/BooksLibrary/providers/BooksLibraryProvider')
        ),
        routes: {
          '': lazy(() => import('@apps/BooksLibrary'))
        },
        togglable: true
      },
      {
        name: 'Music',
        icon: <IconMusic />,
        routes: {
          music: lazy(() => import('@apps/Music'))
        },
        togglable: true
      },
      {
        name: 'Guitar Tabs',
        icon: 'mingcute:guitar-line',
        routes: {
          'guitar-tabs': lazy(() => import('@apps/GuitarTabs'))
        },
        togglable: true
      },
      {
        name: 'Youtube Videos',
        icon: 'tabler:brand-youtube',
        routes: {
          'youtube-videos': lazy(() => import('@apps/YoutubeVideos'))
        },
        togglable: true
      }
    ]
  },
  {
    title: 'Confidential',
    items: [
      {
        name: 'Passwords',
        icon: <IconKey />,
        provider: lazy(
          () => import('@apps/Passwords/providers/PasswordsProvider')
        ),
        routes: {
          '': lazy(() => import('@apps/Passwords'))
        },
        togglable: true
      },
      {
        name: 'API Keys',
        icon: <IconPassword />,
        routes: {
          'api-keys': lazy(() => import('./pages/APIKeys'))
        },
        togglable: false
      }
    ]
  },
  {
    title: 'Information',
    items: [
      {
        name: 'Railway Map',
        icon: 'uil:subway',
        routes: {
          'railway-map': lazy(() => import('@apps/RailwayMap'))
        },
        togglable: true
      }
    ]
  },
  {
    title: 'Utilities',
    items: [
      {
        name: 'Sudoku',
        icon: 'uil:table',
        routes: {
          sudoku: lazy(() => import('@apps/Sudoku'))
        },
        togglable: true
      },
      {
        name: 'Currency Converter',
        icon: <IconCurrencyDollar />,
        routes: {
          'currency-converter': lazy(() => import('@apps/CurrencyConverter'))
        },
        togglable: true
      },
      {
        name: 'Youtube Summarizer',
        icon: 'tabler:brand-youtube',
        routes: {
          'youtube-summarizer': lazy(() => import('@apps/YoutubeSummarizer'))
        },
        togglable: true,
        requiredAPIKeys: ['groq'],
        hasAI: true
      }
    ]
  },
  {
    title: 'Settings',
    items: [
      {
        name: 'Personalization',
        icon: <IconPalette />,
        routes: {
          personalization: lazy(() => import('./pages/Personalization'))
        },
        togglable: false
      },
      {
        name: 'Modules',
        icon: <IconPlug />,
        routes: {
          modules: lazy(() => import('@apps/Modules'))
        },
        togglable: false
      },
      {
        name: 'Server Status',
        icon: <IconServer />,
        routes: {
          'server-status': lazy(() => import('./pages/ServerStatus'))
        },
        togglable: false
      }
    ]
  },
  {
    title: 'sso',
    items: [
      {
        name: 'Localization Manager',
        icon: 'mingcute:translate-line',
        routes: {
          'localization-manager': lazy(
            () => import('./pages/LocalizationManager')
          )
        },
        togglable: false
      }
    ]
  },
  {
    title: '',
    items: [
      {
        name: 'Documentation',
        icon: <IconInfoCircle />,
        routes: {
          documentation: () => {
            window.location.href =
              'https://docs.lifeforge.melvinchia.dev/getting-started/introduction'
            return <Navigate to="/" />
          }
        },
        togglable: false
      },
      {
        name: 'Account Settings',
        icon: <IconUserCog />,
        routes: {
          account: lazy(() => import('./pages/Account'))
        },
        togglable: false,
        hidden: true
      }
    ]
  }
]

export default ROUTES
