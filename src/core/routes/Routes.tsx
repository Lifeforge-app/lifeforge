import { lazy } from 'react'
import { Navigate } from 'react-router'

import { RouteCategory } from './interfaces/routes_interfaces'

export const ROUTES: RouteCategory[] = [
  {
    title: '',
    items: [
      {
        name: 'Dashboard',
        icon: 'tabler:dashboard',
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
        icon: 'tabler:clipboard',
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
        icon: 'tabler:bulb',
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
        icon: 'tabler:list-check',
        routes: {
          'todo-list': lazy(() => import('@modules/TodoList'))
        },
        togglable: true,
        hasAI: true,
        requiredAPIKeys: ['groq']
      },
      {
        name: 'Calendar',
        icon: 'tabler:calendar',
        routes: {
          calendar: lazy(() => import('@modules/Calendar'))
        },
        togglable: true
      },
      {
        name: 'Code Time',
        icon: 'tabler:code',
        routes: {
          'code-time': lazy(() => import('@modules/CodeTime'))
        },
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
        routes: {
          'pomodoro-timer': lazy(() => import('@modules/PomodoroTimer'))
        },
        togglable: true
      },
      {
        name: 'Flashcards',
        icon: 'tabler:cards',
        routes: {
          flashcards: lazy(() => import('@modules/Flashcards')),
          'flashcards/:id': lazy(
            () => import('@modules/Flashcards/components/CardSet')
          )
        },
        togglable: true
      },
      {
        name: 'Notes',
        icon: 'tabler:notebook',
        routes: {
          notes: lazy(() => import('@modules/Notes')),
          'notes/:workspace': lazy(() => import('@modules/Notes/Workspace')),
          'notes/:workspace/:subject/*': lazy(
            () => import('@modules/Notes/Subject')
          )
        },
        togglable: true
      }
    ]
  },
  {
    title: 'Lifestyle',
    items: [
      {
        name: 'Moment Vault',
        icon: 'tabler:history',
        hasAI: true,
        routes: {
          'moment-vault': lazy(() => import('@modules/MomentVault'))
        },
        togglable: true,
        requiredAPIKeys: ['openai']
      },
      {
        name: 'Journal',
        icon: 'tabler:book',
        hasAI: true,
        routes: {
          journal: lazy(() => import('@modules/Journal'))
        },
        togglable: true,
        requiredAPIKeys: ['groq']
      },
      {
        name: 'Achievements',
        icon: 'tabler:award',
        routes: {
          achievements: lazy(() => import('@modules/Achievements'))
        },
        togglable: true
      },
      {
        name: 'Virtual Wardrobe',
        icon: 'tabler:shirt',
        subsection: [
          ['Virtual Wardrobe Clothes', 'tabler:shirt', 'clothes'],
          ['Virtual Wardrobe Outfits', 'tabler:layout', 'outfits']
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
        icon: 'tabler:movie',
        routes: {
          movies: lazy(() => import('@modules/Movies'))
        },
        togglable: true,
        requiredAPIKeys: ['tmdb']
      }
    ]
  },
  {
    title: 'Health & Fitness',
    items: [
      {
        name: 'Workout',
        icon: 'tabler:barbell',
        routes: {
          workout: lazy(() => import('@modules/Workout'))
        },
        togglable: true
      },
      {
        name: 'Nutritions Tracker',
        icon: 'tabler:leaf',
        routes: {
          'nutritions-tracker': lazy(() => import('@modules/NutritionsTracker'))
        },
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
        provider: lazy(
          () => import('@modules/Wallet/providers/WalletProvider')
        ),
        hasAI: true,
        subsection: [
          ['Dashboard', 'tabler:dashboard', ''],
          ['Transactions', 'tabler:arrows-exchange', 'transactions'],
          ['Assets', 'tabler:wallet', 'assets'],
          ['Ledgers', 'tabler:book', 'ledgers'],
          ['Financial Statements', 'tabler:file-text', 'statements']
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
        icon: 'tabler:heart',
        routes: {
          wishlist: lazy(() => import('@modules/Wishlist')),
          'wishlist/:id': lazy(
            () => import('@modules/Wishlist/pages/WishlistEntries')
          )
        },
        togglable: true,
        hasAI: true
      },
      {
        name: 'Budgets',
        icon: 'tabler:calculator',
        routes: {
          budgets: lazy(() => import('@modules/Budget'))
        },
        togglable: true
      }
    ]
  },
  {
    title: 'Storage',
    items: [
      {
        name: 'Books Library',
        icon: 'tabler:books',
        provider: lazy(
          () => import('@modules/BooksLibrary/providers/BooksLibraryProvider')
        ),
        routes: {
          '': lazy(() => import('@modules/BooksLibrary'))
        },
        togglable: true
      },
      {
        name: 'Photos',
        icon: 'tabler:camera',
        provider: lazy(
          () => import('@modules/Photos/providers/PhotosProvider')
        ),
        routes: {
          '': lazy(() => import('@modules/Photos/pages/MainGallery')),
          album: lazy(() => import('@modules/Photos/pages/AlbumList')),
          'album/:id': lazy(() => import('@modules/Photos/pages/AlbumGallery')),
          favourites: lazy(
            () => import('@modules/Photos/pages/FavouritesGallery')
          ),
          'locked-folder': lazy(
            () => import('@modules/Photos/pages/LockedFolderGallery')
          ),
          trash: lazy(() => import('@modules/Photos/pages/Trash'))
        },
        togglable: true
      },
      {
        name: 'Music',
        icon: 'tabler:music',
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
      },
      {
        name: '3D Models',
        icon: 'tabler:cube',
        routes: {
          '3d-models': lazy(() => import('@modules/3dModels'))
        },
        togglable: true
      }
    ]
  },
  {
    title: 'External Management',
    items: [
      {
        name: 'Mail Inbox',
        icon: 'tabler:mail',
        routes: {
          'mail-inbox': lazy(() => import('@modules/MailInbox'))
        },
        togglable: true,
        requiredAPIKeys: ['gmail']
      },
      {
        name: 'DNS Records',
        icon: 'tabler:cloud',
        routes: {
          'dns-records': lazy(() => import('@modules/DNSRecords'))
        },
        togglable: true,
        requiredAPIKeys: ['cpanel']
      },
      {
        name: 'Blog Posts',
        icon: 'tabler:file-text',
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
        icon: 'tabler:password',
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
      },
      {
        name: 'Airports',
        icon: 'ic:round-connecting-airports',
        routes: {
          airports: lazy(
            () => import('@modules/Airports/pages/lists/Continents')
          ),
          'airports/:continentID': lazy(
            () => import('@modules/Airports/pages/lists/Countries')
          ),
          'airports/:continentID/:countryID': lazy(
            () => import('@modules/Airports/pages/lists/Regions')
          ),
          'airports/:continentID/:countryID/:regionID': lazy(
            () => import('@modules/Airports/pages/lists/AirportList')
          ),
          'airports/:continentID/:countryID/:regionID/:airportID': lazy(
            () => import('@modules/Airports/pages/Airport')
          )
        },
        togglable: true,
        hasAI: true,
        requiredAPIKeys: ['groq']
      },
      {
        name: 'Changi Airport',
        icon: 'tabler:plane',
        subsection: [
          ['Flight Status', 'tabler:list', 'changi-flight-status'],
          ['Airline Information', 'tabler:line', '']
        ],
        routes: {
          'changi-airport': () => (
            <Navigate to="/changi-airport/changi-flight-status" />
          ),
          'changi-airport/changi-flight-status': lazy(
            () => import('@modules/ChangiFlightStatus')
          )
        },
        togglable: true
      },
      {
        name: 'CFOP Algorithms',
        icon: 'tabler:cube',
        routes: {
          'cfop-algorithms': lazy(() => import('@modules/CFOPAlgorithms')),
          'cfop-algorithms/f2l': lazy(
            () => import('@modules/CFOPAlgorithms/pages/F2L')
          ),
          'cfop-algorithms/oll': lazy(
            () => import('@modules/CFOPAlgorithms/pages/OLL')
          ),
          'cfop-algorithms/pll': lazy(
            () => import('@modules/CFOPAlgorithms/pages/PLL')
          )
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
      },
      {
        name: 'ASCII Text Generator',
        icon: 'tabler:terminal',
        routes: {
          'ascii-text-generator': lazy(
            () => import('@modules/AsciiTextGenerator')
          )
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
        routes: {
          personalization: lazy(() => import('@modules/Personalization'))
        },
        togglable: false,
        requiredAPIKeys: ['pixabay']
      },
      {
        name: 'Modules',
        icon: 'tabler:plug',
        routes: {
          modules: lazy(() => import('@modules/Modules'))
        },
        togglable: false
      },
      {
        name: 'Server Status',
        icon: 'tabler:server',
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
        icon: 'tabler:info-circle',
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
        icon: 'tabler:user-cog',
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
