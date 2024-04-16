/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { Suspense, lazy, useContext, useMemo } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Loading from '@components/Loading'
import { AuthContext } from '@providers/AuthProvider'
import PhotosFavouritesGallery from './modules/Photos/pages/FavouritesGallery'
import Repositories from './modules/Repositories'
import { titleToPath } from './utils/strings'

const PhotosProvider = lazy(
  async () => await import('./providers/PhotosProvider')
)
const PhotosMainGallery = lazy(
  async () => await import('./modules/Photos/pages/MainGallery')
)
const PhotosAlbumList = lazy(
  async () => await import('./modules/Photos/pages/AlbumList')
)
const PhotosAlbumGallery = lazy(
  async () => await import('./modules/Photos/pages/AlbumGallery')
)
const Dashboard = lazy(async () => await import('./modules/Dashboard'))
const Auth = lazy(async () => await import('./auth'))
const MainApplication = lazy(async () => await import('./MainApplication'))
const TodoList = lazy(async () => await import('./modules/TodoList'))
const Calendar = lazy(async () => await import('./modules/Calendar'))
const ProjectsM = lazy(async () => await import('./modules/ProjectsM'))
const Kanban = lazy(
  async () => await import('./modules/ProjectsM/components/Kanban')
)
const NotFound = lazy(async () => await import('./components/general/NotFound'))
const IdeaBox = lazy(async () => await import('./modules/IdeaBox'))
const Ideas = lazy(
  async () => await import('./modules/IdeaBox/components/Ideas')
)
const CodeTime = lazy(async () => await import('./modules/CodeTime'))
const PomodoroTimer = lazy(async () => await import('./modules/PomodoroTimer'))
const Flashcards = lazy(async () => await import('./modules/Flashcards'))
const CardSet = lazy(
  async () => await import('./modules/Flashcards/components/CardSet')
)
const ReferenceBooks = lazy(
  async () => await import('./modules/ReferenceBooks')
)
const Changelog = lazy(async () => await import('./modules/Changelog'))
const Notes = lazy(async () => await import('./modules/Notes'))
const NotesCategory = lazy(
  async () => await import('./modules/Notes/Workspace')
)
const NotesSubject = lazy(async () => await import('./modules/Notes/Subject'))
const Personalization = lazy(
  async () => await import('./modules/Personalization')
)
const ServerStatus = lazy(async () => await import('./modules/ServerStatus'))
const Spotify = lazy(async () => await import('./modules/Spotify'))
const Modules = lazy(async () => await import('./modules/Modules'))
const ProjectsKList = lazy(
  async () => await import('./modules/ProjectsK/pages/ProjectList')
)
const ProjectsKEntry = lazy(
  async () => await import('./modules/ProjectsK/pages/ProjectEntry')
)
const NotesFile = lazy(async () => await import('./modules/Notes/File'))
const Passwords = lazy(async () => await import('./modules/Passwords'))

interface IRoutesItem {
  name: string
  icon: string
  routes: React.ReactElement[]
  subsection?: string[][]
  togglable: boolean
}
interface IRoutes {
  title: string
  items: IRoutesItem[]
}

export const ROUTES: IRoutes[] = [
  {
    title: '',
    items: [
      {
        name: 'Dashboard',
        icon: 'tabler:dashboard',
        routes: [
          <Route key="dashboard" path="dashboard" element={<Dashboard />} />
        ],
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
        routes: [
          <Route key="projects-m" path="projects-m" element={<ProjectsM />} />,
          <Route
            key="projects-m-id"
            path="projects-m/:id"
            element={<Kanban />}
          />
        ],
        togglable: true
      },
      {
        name: 'Projects (K)',
        icon: 'tabler:clipboard',
        routes: [
          <Route
            key="projects-k"
            path="projects-k"
            element={<ProjectsKList />}
          />,
          <Route
            key="projects-k-id"
            path="projects-k/:id"
            element={<ProjectsKEntry />}
          />
        ],
        togglable: true
      },
      {
        name: 'Idea Box',
        icon: 'tabler:bulb',
        routes: [
          <Route key="idea-box" path="idea-box" element={<IdeaBox />} />,
          <Route key="idea-box-id" path="idea-box/:id" element={<Ideas />} />
        ],
        togglable: true
      },
      {
        name: 'Todo List',
        icon: 'tabler:list-check',
        routes: [
          <Route key="todo-list" path="todo-list" element={<TodoList />} />
        ],
        togglable: true
      },
      {
        name: 'Calendar',
        icon: 'tabler:calendar',
        routes: [
          <Route key="calendar" path="calendar" element={<Calendar />} />
        ],
        togglable: true
      },
      {
        name: 'Spotify',
        icon: 'tabler:brand-spotify',
        routes: [<Route key="spotify" path="spotify" element={<Spotify />} />],
        togglable: true
      },
      {
        name: 'Code Time',
        icon: 'tabler:code',
        routes: [
          <Route key="code-time" path="code-time" element={<CodeTime />} />
        ],
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
        routes: [
          <Route key="photos" path="/photos" element={<PhotosProvider />}>
            <Route
              key="photos-main-gallery"
              path=""
              element={<PhotosMainGallery />}
            />
            ,
            <Route
              key="photos-album-list"
              path="album"
              element={<PhotosAlbumList />}
            />
            ,
            <Route
              key="photos-album-gallery"
              path="album/:id"
              element={<PhotosAlbumGallery />}
            />
            ,
            <Route
              key="photos-album-favourites"
              path="favourites"
              element={<PhotosFavouritesGallery />}
            />
          </Route>
        ],
        togglable: true
      },
      {
        name: 'Repositories',
        icon: 'tabler:git-branch',
        routes: [
          <Route
            key="repositories"
            path="repositories"
            element={<Repositories />}
          />
        ],
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
        routes: [
          <Route
            key="pomodoro-timer"
            path="pomodoro-timer"
            element={<PomodoroTimer />}
          />
        ],
        togglable: true
      },
      {
        name: 'Flashcards',
        icon: 'tabler:cards',
        routes: [
          <Route key="flashcards" path="flashcards" element={<Flashcards />} />,
          <Route
            key="flashcards-id"
            path="flashcards/:id"
            element={<CardSet />}
          />
        ],
        togglable: true
      },
      {
        name: 'Notes',
        icon: 'tabler:notebook',
        routes: [
          <Route key="notes" path="notes" element={<Notes />} />,
          <Route
            key="notes-workspace"
            path="notes/:workspace"
            element={<NotesCategory />}
          />,
          <Route
            key="notes-file"
            path="notes/:workspace/:subject/file/:id"
            element={<NotesFile />}
          />,
          <Route
            key="notes-subject"
            path="notes/:workspace/:subject/*"
            element={<NotesSubject />}
          />
        ],
        togglable: true
      },
      {
        name: 'Reference Books',
        icon: 'tabler:books',
        routes: [
          <Route
            key="reference-books"
            path="reference-books"
            element={<ReferenceBooks />}
          />
        ],
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
        routes: [],
        togglable: true
      },
      {
        name: 'Wish List',
        icon: 'tabler:heart',
        routes: [],
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
        routes: [],
        togglable: true
      },
      {
        name: 'Passwords',
        icon: 'tabler:key',
        routes: [
          <Route key="passwords" path="passwords" element={<Passwords />} />
        ],
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
        routes: [
          <Route
            key="personalization"
            path="personalization"
            element={<Personalization />}
          />
        ],
        togglable: false
      },
      {
        name: 'Modules',
        icon: 'tabler:plug',
        routes: [<Route key="modules" path="modules" element={<Modules />} />],
        togglable: false
      },
      {
        name: 'Data Backup',
        icon: 'tabler:database',
        routes: [
          <Route key="data-backup" path="data-backup" element={<></>} />
        ],
        togglable: false
      },
      {
        name: 'Server Status',
        icon: 'tabler:server',
        routes: [
          <Route
            key="server-status"
            path="server-status"
            element={<ServerStatus />}
          />
        ],
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
        routes: [
          <Route key="change-log" path="change-log" element={<Changelog />} />
        ],
        togglable: false
      }
    ]
  }
]

function AppRouter(): React.ReactElement {
  const { auth, authLoading, userData } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  useMemo(() => {
    if (!authLoading) {
      if (!auth && location.pathname !== '/auth') {
        navigate('/auth?redirect=' + location.pathname + location.search)
      } else if (auth) {
        if (location.pathname === '/auth') {
          if (location.search) {
            const redirect = new URLSearchParams(location.search).get(
              'redirect'
            )
            if (redirect) {
              navigate(redirect)
            } else {
              navigate('/dashboard')
            }
          }
        } else if (location.pathname === '/') {
          navigate('/dashboard')
        }
      }
    }
  }, [auth, location, authLoading])

  return (
    <Suspense fallback={<Loading customMessage="Loading module" />}>
      <Routes>
        <Route path="/" element={<MainApplication />}>
          {userData ? (
            ROUTES.flatMap(e => e.items)
              .filter(
                item =>
                  !item.togglable ||
                  userData.enabledModules.includes(titleToPath(item.name))
              )
              .map(item => item.routes)
          ) : (
            <Route path="*" element={<NotFound />} />
          )}
        </Route>
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
