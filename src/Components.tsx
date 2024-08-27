import React, { lazy } from 'react'
import { Navigate } from 'react-router'

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
const PhotosLockedFolderGallery = lazy(
  async () => await import('./modules/Photos/pages/LockedFolderGallery')
)
const PhotosTrash = lazy(
  async () => await import('./modules/Photos/pages/Trash')
)
const Dashboard = lazy(async () => await import('./modules/Dashboard'))
const TodoList = lazy(async () => await import('./modules/TodoList'))
const Calendar = lazy(async () => await import('./modules/Calendar'))
const ProjectsM = lazy(async () => await import('./modules/ProjectsM'))
const ProjectsMProvider = lazy(
  async () => await import('./providers/ProjectsMProvider')
)
const Kanban = lazy(
  async () => await import('./modules/ProjectsM/pages/Kanban')
)
const IdeaBox = lazy(async () => await import('./modules/IdeaBox'))
const Ideas = lazy(
  async () => await import('./modules/IdeaBox/components/Ideas')
)
const Folder = lazy(
  async () => await import('./modules/IdeaBox/components/Folder')
)
const CodeTime = lazy(async () => await import('./modules/CodeTime'))
const PomodoroTimer = lazy(async () => await import('./modules/PomodoroTimer'))
const Flashcards = lazy(async () => await import('./modules/Flashcards'))
const CardSet = lazy(
  async () => await import('./modules/Flashcards/components/CardSet')
)
const ReferenceBooks = lazy(async () => await import('./modules/BooksLibrary'))
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
const Music = lazy(async () => await import('./modules/Music'))
const Repositories = lazy(async () => await import('./modules/Repositories'))
const Achievements = lazy(async () => await import('./modules/Achievements'))
const DNSRecords = lazy(async () => await import('./modules/DNSRecords'))
const MailInbox = lazy(async () => await import('./modules/MailInbox'))
const Wallet = lazy(
  async () => await import('./modules/Wallet/pages/Dashboard')
)
const Assets = lazy(async () => await import('./modules/Wallet/pages/Assets'))
const Ledgers = lazy(async () => await import('./modules/Wallet/pages/Ledgers'))
const Transactions = lazy(
  async () => await import('./modules/Wallet/pages/Transactions')
)
const WalletProvider = lazy(
  async () => await import('./providers/WalletProvider')
)
const LocalizationManager = lazy(
  async () => await import('./modules/LocalizationManager')
)
const GuitarTabs = lazy(async () => await import('./modules/GuitarTabs'))
const Airports = lazy(
  async () => await import('./modules/Airports/pages/lists/Continents')
)
const Countries = lazy(
  async () => await import('./modules/Airports/pages/lists/Countries')
)
const Regions = lazy(
  async () => await import('./modules/Airports/pages/lists/Regions')
)
const AirportsList = lazy(
  async () => await import('./modules/Airports/pages/lists/AirportList')
)
const Airport = lazy(
  async () => await import('./modules/Airports/pages/Airport')
)
const Account = lazy(async () => await import('./modules/Account'))
const ChangiFlightStatus = lazy(
  async () => await import('./modules/ChangiFlightStatus')
)
const CFOPAlgorithms = lazy(
  async () => await import('./modules/CFOPAlgorithms')
)
const CFOPF2L = lazy(
  async () => await import('./modules/CFOPAlgorithms/pages/F2L')
)
const CFOPOLL = lazy(
  async () => await import('./modules/CFOPAlgorithms/pages/OLL')
)

export const COMPONENTS = {
  dashboard: {
    dashboard: Dashboard
  },
  'projects-m': {
    'projects-m-provider': ProjectsMProvider,
    'projects-m': ProjectsM,
    'projects-m-id': Kanban
  },
  photos: {
    'photos-provider': PhotosProvider,
    'photos-main-gallery': PhotosMainGallery,
    'photos-album-list': PhotosAlbumList,
    'photos-album-gallery': PhotosAlbumGallery,
    'photos-album-favourites': PhotosFavouritesGallery,
    'photos-locked-folder-gallery': PhotosLockedFolderGallery,
    'photos-trash': PhotosTrash
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
    'idea-box-id': Ideas,
    'idea-box-folder': Folder
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
    journal: Journal
  },
  achievements: {
    achievements: Achievements
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
  'mail-inbox': {
    'mail-inbox': MailInbox
  },
  'dns-records': {
    'dns-records': DNSRecords
  },
  wallet: {
    'wallet-provider': WalletProvider,
    wallet: Wallet,
    assets: Assets,
    ledgers: Ledgers,
    transactions: Transactions
  },
  'localization-manager': {
    'localization-manager': LocalizationManager
  },
  'guitar-tabs': {
    'guitar-tabs': GuitarTabs
  },
  'account-settings': {
    account: Account
  },
  documentation: {
    documentation: () => {
      window.location.href =
        'https://docs.lifeforge.thecodeblog.net/getting-started/introduction'
      return (<Navigate to="/" />) as React.ReactElement
    }
  },
  'changi-flight-status': {
    'changi-flight-status': ChangiFlightStatus
  },
  airports: {
    airports: Airports,
    'airports-countries': Countries,
    'airports-regions': Regions,
    'airports-airports': AirportsList,
    'airports-airport': Airport
  },
  'cfop-algorithms': {
    'cfop-algorithms': CFOPAlgorithms,
    'cfop-algorithms-f2l': CFOPF2L,
    'cfop-algorithms-oll': CFOPOLL
  }
}
