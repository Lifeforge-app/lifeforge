import {
  IconArrowsExchange,
  IconAward,
  IconBook,
  IconBooks,
  IconBulb,
  IconCalendar,
  IconClipboard,
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

import { RouteCategory } from './interfaces/routes_interfaces'

export const ROUTES: RouteCategory[] = [
  {
    title: '',
    items: [
      {
        name: 'Dashboard',
        icon: <IconDashboard />,
        routes: {
          dashboard: lazy(() => import('@modules/Dashboard'))
        },
        togglable: false
      }
    ]
  },
  {
    title: 'Productivity',
    items: [
      {
        name: 'Projects (M)',
        icon: <IconClipboard />,
        provider: lazy(
          () => import('@modules/ProjectsM/providers/ProjectsMProvider')
        ),
        routes: {
          '': lazy(() => import('@modules/ProjectsM')),
          ':id': lazy(() => import('@modules/ProjectsM/pages/Kanban'))
        },
        togglable: true
      },
      {
        name: 'Idea Box',
        icon: <IconBulb />,
        routes: {
          'idea-box': lazy(() => import('@modules/IdeaBox')),
          'idea-box/:id/*': lazy(
            () => import('@modules/IdeaBox/components/Ideas')
          )
        },
        togglable: true
      },
      {
        name: 'Todo List',
        icon: <IconListCheck />,
        routes: {
          'todo-list': lazy(() => import('@modules/TodoList'))
        },
        togglable: true,
        hasAI: true,
        requiredAPIKeys: ['groq']
      },
      {
        name: 'Calendar',
        icon: <IconCalendar />,
        routes: {
          calendar: lazy(() => import('@modules/Calendar'))
        },
        togglable: true
      },
      {
        name: 'Code Time',
        icon: <IconCode />,
        routes: {
          'code-time': lazy(() => import('@modules/CodeTime'))
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
          'moment-vault': lazy(() => import('@modules/MomentVault'))
        },
        togglable: true,
        requiredAPIKeys: ['openai']
      },
      {
        name: 'Achievements',
        icon: <IconAward />,
        routes: {
          achievements: lazy(() => import('@modules/Achievements'))
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
            () => import('@modules/VirtualWardrobe/pages/Clothes')
          ),
          'virtual-wardrobe/outfits': lazy(
            () => import('@modules/VirtualWardrobe/pages/Outfits')
          )
        },
        togglable: true
      },
      {
        name: 'Movies',
        icon: <IconMovie />,
        routes: {
          movies: lazy(() => import('@modules/Movies'))
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
        provider: lazy(
          () => import('@modules/Wallet/providers/WalletProvider')
        ),
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
          '': lazy(() => import('@modules/Wallet/pages/Dashboard')),
          transactions: lazy(
            () => import('@modules/Wallet/pages/Transactions')
          ),
          assets: lazy(() => import('@modules/Wallet/pages/Assets')),
          ledgers: lazy(() => import('@modules/Wallet/pages/Ledgers')),
          statements: lazy(() => import('@modules/Wallet/pages/Statements'))
        },
        togglable: true
      },
      {
        name: 'Wishlist',
        icon: <IconHeart />,
        routes: {
          wishlist: lazy(() => import('@modules/Wishlist')),
          'wishlist/:id': lazy(
            () => import('@modules/Wishlist/pages/WishlistEntries')
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
          () => import('@modules/BooksLibrary/providers/BooksLibraryProvider')
        ),
        routes: {
          '': lazy(() => import('@modules/BooksLibrary'))
        },
        togglable: true
      },
      {
        name: 'Music',
        icon: <IconMusic />,
        routes: {
          music: lazy(() => import('@modules/Music'))
        },
        togglable: true
      },
      {
        name: 'Guitar Tabs',
        icon: 'mingcute:guitar-line',
        routes: {
          'guitar-tabs': lazy(() => import('@modules/GuitarTabs'))
        },
        togglable: true
      },
      {
        name: 'Youtube Videos',
        icon: 'tabler:brand-youtube',
        routes: {
          'youtube-videos': lazy(() => import('@modules/YoutubeVideos'))
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
          () => import('@modules/Passwords/providers/PasswordsProvider')
        ),
        routes: {
          '': lazy(() => import('@modules/Passwords'))
        },
        togglable: true
      },
      {
        name: 'API Keys',
        icon: <IconPassword />,
        routes: {
          'api-keys': lazy(() => import('@modules/APIKeys'))
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
          'railway-map': lazy(() => import('@modules/RailwayMap'))
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
          sudoku: lazy(() => import('@modules/Sudoku'))
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
        icon: <IconPalette />,
        routes: {
          personalization: lazy(() => import('@modules/Personalization'))
        },
        togglable: false,
        requiredAPIKeys: ['pixabay']
      },
      {
        name: 'Modules',
        icon: <IconPlug />,
        routes: {
          modules: lazy(() => import('@modules/Modules'))
        },
        togglable: false
      },
      {
        name: 'Server Status',
        icon: <IconServer />,
        routes: {
          'server-status': lazy(() => import('@modules/ServerStatus'))
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
            () => import('@modules/LocalizationManager')
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
          account: lazy(() => import('@modules/Account'))
        },
        togglable: false,
        hidden: true
      }
    ]
  }
]

export default ROUTES
