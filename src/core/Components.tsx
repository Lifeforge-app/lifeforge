import React, { lazy } from 'react'
import { Navigate } from 'react-router'
import Statements from '../modules/Wallet/pages/Statements'

const PhotosProvider = lazy(
  async () => await import('../providers/PhotosProvider')
)
const PhotosMainGallery = lazy(
  async () => await import('../modules/Photos/pages/MainGallery')
)
const PhotosAlbumList = lazy(
  async () => await import('../modules/Photos/pages/AlbumList')
)
const PhotosAlbumGallery = lazy(
  async () => await import('../modules/Photos/pages/AlbumGallery')
)
const PhotosFavouritesGallery = lazy(
  async () => await import('../modules/Photos/pages/FavouritesGallery')
)
const PhotosLockedFolderGallery = lazy(
  async () => await import('../modules/Photos/pages/LockedFolderGallery')
)
const PhotosTrash = lazy(
  async () => await import('../modules/Photos/pages/Trash')
)
const Dashboard = lazy(async () => await import('../modules/Dashboard'))
const TodoList = lazy(async () => await import('../modules/TodoList'))
const Calendar = lazy(async () => await import('../modules/Calendar'))
const ProjectsM = lazy(async () => await import('../modules/ProjectsM'))
const ProjectsMProvider = lazy(
  async () => await import('../providers/ProjectsMProvider')
)
const Kanban = lazy(
  async () => await import('../modules/ProjectsM/pages/Kanban')
)
const IdeaBox = lazy(async () => await import('../modules/IdeaBox'))
const Ideas = lazy(
  async () => await import('../modules/IdeaBox/components/Ideas')
)
const CodeTime = lazy(async () => await import('../modules/CodeTime'))
const PomodoroTimer = lazy(async () => await import('../modules/PomodoroTimer'))
const Flashcards = lazy(async () => await import('../modules/Flashcards'))
const CardSet = lazy(
  async () => await import('../modules/Flashcards/components/CardSet')
)
const BooksLibraryProvider = lazy(
  async () => await import('../providers/BooksLibraryProvider')
)
const BooksLibrary = lazy(async () => await import('../modules/BooksLibrary'))
const Changelog = lazy(async () => await import('../modules/Changelog'))
const Notes = lazy(async () => await import('../modules/Notes'))
const NotesCategory = lazy(
  async () => await import('../modules/Notes/Workspace')
)
const NotesSubject = lazy(async () => await import('../modules/Notes/Subject'))
const Personalization = lazy(
  async () => await import('../modules/Personalization')
)
const ServerStatus = lazy(async () => await import('../modules/ServerStatus'))
const Modules = lazy(async () => await import('../modules/Modules'))
const PasswordsProvider = lazy(
  async () => await import('../providers/PasswordsProvider')
)
const Passwords = lazy(async () => await import('../modules/Passwords'))
const Journal = lazy(async () => await import('../modules/Journal'))
const Music = lazy(async () => await import('../modules/Music'))
const Repositories = lazy(async () => await import('../modules/Repositories'))
const Achievements = lazy(async () => await import('../modules/Achievements'))
const DNSRecords = lazy(async () => await import('../modules/DNSRecords'))
const MailInbox = lazy(async () => await import('../modules/MailInbox'))
const Wallet = lazy(
  async () => await import('../modules/Wallet/pages/Dashboard')
)
const Assets = lazy(async () => await import('../modules/Wallet/pages/Assets'))
const Ledgers = lazy(
  async () => await import('../modules/Wallet/pages/Ledgers')
)
const Transactions = lazy(
  async () => await import('../modules/Wallet/pages/Transactions')
)
const WalletProvider = lazy(
  async () => await import('../providers/WalletProvider')
)
const LocalizationManager = lazy(
  async () => await import('../modules/LocalizationManager')
)
const GuitarTabs = lazy(async () => await import('../modules/GuitarTabs'))
const Airports = lazy(
  async () => await import('../modules/Airports/pages/lists/Continents')
)
const Countries = lazy(
  async () => await import('../modules/Airports/pages/lists/Countries')
)
const Regions = lazy(
  async () => await import('../modules/Airports/pages/lists/Regions')
)
const AirportsList = lazy(
  async () => await import('../modules/Airports/pages/lists/AirportList')
)
const Airport = lazy(
  async () => await import('../modules/Airports/pages/Airport')
)
const Account = lazy(async () => await import('../modules/Account'))
const ChangiFlightStatus = lazy(
  async () => await import('../modules/ChangiFlightStatus')
)
const CFOPAlgorithms = lazy(
  async () => await import('../modules/CFOPAlgorithms')
)
const CFOPF2L = lazy(
  async () => await import('../modules/CFOPAlgorithms/pages/F2L')
)
const CFOPOLL = lazy(
  async () => await import('../modules/CFOPAlgorithms/pages/OLL')
)
const CFOPPLL = lazy(
  async () => await import('../modules/CFOPAlgorithms/pages/PLL')
)
const YoutubeVideos = lazy(async () => await import('../modules/YoutubeVideos'))
const APIKeys = lazy(async () => await import('../modules/APIKeys'))
const Wishlist = lazy(async () => await import('../modules/Wishlist'))
const WishlistEntries = lazy(
  async () => await import('../modules/Wishlist/pages/WishlistEntries')
)
const Budgets = lazy(async () => await import('../modules/Budget'))
const Workout = lazy(async () => await import('../modules/Workout'))
const _3dModels = lazy(async () => await import('../modules/3dModels'))
const Sudoku = lazy(async () => await import('../modules/Sudoku'))
const MinecraftServerList = lazy(
  async () => await import('../modules/MinecraftServerList')
)
const AsciiTextGenerator = lazy(
  async () => await import('../modules/AsciiTextGenerator')
)
const OpenaiApiPricing = lazy(
  async () => await import('../modules/OpenaiApiPricing')
)
const NutritionsTracker = lazy(
  async () => await import('../modules/NutritionsTracker')
)
const VirtualWardrobeClothes = lazy(
  async () => await import('../modules/VirtualWardrobe/pages/Clothes')
)
const MomentVault = lazy(async () => await import('../modules/MomentVault'))
const Movies = lazy(async () => import('../modules/Movies'))
const RailwayMap = lazy(async () => import('../modules/RailwayMap'))

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
    'notes-subject': NotesSubject
  },
  'books-library': {
    'books-library-provider': BooksLibraryProvider,
    'books-library': BooksLibrary
  },
  passwords: {
    'passwords-provider': PasswordsProvider,
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
    transactions: Transactions,
    statements: Statements
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
        'https://docs.lifeforge.melvinchia.dev/getting-started/introduction'
      return (<Navigate to="/" />) as React.ReactElement
    }
  },
  'changi-airport': {
    'changi-airport': () => {
      return <Navigate to="/changi-airport/changi-flight-status" />
    },
    'flight-status': ChangiFlightStatus
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
    'cfop-algorithms-oll': CFOPOLL,
    'cfop-algorithms-pll': CFOPPLL
  },
  'youtube-videos': {
    'youtube-videos': YoutubeVideos
  },
  'api-keys': {
    'api-keys': APIKeys
  },
  wishlist: {
    wishlist: Wishlist,
    'wishlist-entries': WishlistEntries
  },
  budgets: {
    budgets: Budgets
  },
  workout: {
    workout: Workout
  },
  '3d-models': {
    '3d-models': _3dModels
  },
  sudoku: {
    sudoku: Sudoku
  },
  'minecraft-server-list': {
    'minecraft-server-list': MinecraftServerList
  },
  'ascii-text-generator': {
    'ascii-text-generator': AsciiTextGenerator
  },
  'openai-api-pricing': {
    'openai-api-pricing': OpenaiApiPricing
  },
  'nutritions-tracker': {
    'nutritions-tracker': NutritionsTracker
  },
  'virtual-wardrobe': {
    'virtual-wardrobe': () => <Navigate to="/virtual-wardrobe/clothes" />,
    'virtual-wardrobe-clothes': VirtualWardrobeClothes
  },
  'moment-vault': {
    'moment-vault': MomentVault
  },
  movies: {
    movies: Movies
  },
  'railway-map': {
    'railway-map': RailwayMap
  }
}
