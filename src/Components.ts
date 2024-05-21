import { lazy } from 'react'

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
const PhotosFavouritesGallery = lazy(
  async () => await import('./modules/Photos/pages/FavouritesGallery')
)
const Dashboard = lazy(async () => await import('./modules/Dashboard'))
const TodoList = lazy(async () => await import('./modules/TodoList'))
const Calendar = lazy(async () => await import('./modules/Calendar'))
const ProjectsM = lazy(async () => await import('./modules/ProjectsM'))
const Kanban = lazy(
  async () => await import('./modules/ProjectsM/components/Kanban')
)
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
const Journal = lazy(async () => await import('./modules/Journal'))
const JournalView = lazy(
  async () => await import('./modules/Journal/JournalView')
)
const JournalEdit = lazy(
  async () => await import('./modules/Journal/JournalEdit')
)
const Music = lazy(async () => await import('./modules/Music'))
const Repositories = lazy(async () => await import('./modules/Repositories'))
const About = lazy(async () => await import('./modules/About'))

export const COMPONENTS = {
  dashboard: {
    dashboard: Dashboard
  },
  'projects-m': {
    'projects-m': ProjectsM,
    'projects-m-id': Kanban
  },
  photos: {
    'photos-provider': PhotosProvider,
    'photos-main-gallery': PhotosMainGallery,
    'photos-album-list': PhotosAlbumList,
    'photos-album-gallery': PhotosAlbumGallery,
    'photos-album-favourites': PhotosFavouritesGallery
  },
  music: {
    music: Music
  },
  'projects-k': {
    'projects-k': ProjectsKList,
    'projects-k-id': ProjectsKEntry
  },
  'idea-box': {
    'idea-box': IdeaBox,
    'idea-box-id': Ideas
  },
  'todo-list': {
    'todo-list': TodoList
  },
  calendar: {
    calendar: Calendar
  },
  spotify: {
    spotify: Spotify
  },
  'code-time': {
    'code-time': CodeTime
  },
  repositories: {
    repositories: Repositories
  },
  'pomodoro-timer': {
    'pomodoro-timer': PomodoroTimer
  },
  flashcards: {
    flashcards: Flashcards,
    'flashcards-id': CardSet
  },
  notes: {
    notes: Notes,
    'notes-workspace': NotesCategory,
    'notes-file': NotesFile,
    'notes-subject': NotesSubject
  },
  'books-library': {
    'books-library': ReferenceBooks
  },
  passwords: {
    passwords: Passwords
  },
  journal: {
    journal: Journal,
    'journal-view': JournalView,
    'journal-edit': JournalEdit
  },
  personalization: {
    personalization: Personalization
  },
  modules: {
    modules: Modules
  },
  'server-status': {
    'server-status': ServerStatus
  },
  'data-backup': {
    'data-backup': ServerStatus // TODO
  },
  'change-log': {
    'change-log': Changelog
  },
  about: {
    about: About
  }
}
