export const QUICK_ACTIONS = {
  Productivity: [
    {
      module: 'Projects (M)',
      action: 'View Projects (M)',
      route: 'projects-m'
    },
    {
      module: 'Projects (M)',
      action: 'View Project (M) by ID',
      route: 'projects-m/:id'
    },
    {
      module: 'Projects (M)',
      action: 'Create Project (M)',
      route: 'projects-m/new'
    },
    {
      module: 'Projects (K)',
      action: 'View Projects (K)',
      route: 'projects-k'
    },
    {
      module: 'Projects (K)',
      action: 'View Project (K) by ID',
      route: 'projects-k/:id'
    },
    {
      module: 'Projects (K)',
      action: 'Create Project (K)',
      route: 'projects-k/new'
    },
    { module: 'Idea Box', action: 'View Idea Box', route: 'idea-box' },
    {
      module: 'Idea Box',
      action: 'View Idea Box Item by ID',
      route: 'idea-box/:id'
    },
    { module: 'Idea Box', action: 'Create Idea', route: 'idea-box/new' },
    { module: 'Todo List', action: 'View Todo List', route: 'todo-list' },
    { module: 'Todo List', action: 'Create Todo', route: 'todo-list/new' },
    { module: 'Calendar', action: 'View Calendar', route: 'calendar' },
    { module: 'Calendar', action: 'Create Event', route: 'calendar/new' },
    { module: 'Spotify', action: 'View Spotify', route: 'spotify' },
    { module: 'Code Time', action: 'View Code Time', route: 'code-time' }
  ],
  Storage: [
    {
      module: 'Photos',
      action: 'View Photos Main Gallery',
      route: 'photos-main-gallery'
    },
    { module: 'Photos', action: 'View Photos Album List', route: 'album' },
    {
      module: 'Photos',
      action: 'View Photos Album Gallery by ID',
      route: 'album/:id'
    },
    {
      module: 'Photos',
      action: 'View Photos Album Favourites',
      route: 'favourites'
    },
    { module: 'Photos', action: 'Create Album', route: 'album/new' },
    { module: 'Music', action: 'View Music', route: 'music' },
    {
      module: 'Repositories',
      action: 'View Repositories',
      route: 'repositories'
    },
    {
      module: 'Repositories',
      action: 'Create Repository',
      route: 'repositories/new'
    }
  ],
  Study: [
    {
      module: 'Pomodoro Timer',
      action: 'View Pomodoro Timer',
      route: 'pomodoro-timer'
    },
    { module: 'Flashcards', action: 'View Flashcards', route: 'flashcards' },
    {
      module: 'Flashcards',
      action: 'View Flashcard by ID',
      route: 'flashcards/:id'
    },
    {
      module: 'Flashcards',
      action: 'Create Flashcard',
      route: 'flashcards/new'
    },
    { module: 'Notes', action: 'View Notes', route: 'notes' },
    {
      module: 'Notes',
      action: 'View Notes Workspace',
      route: 'notes/:workspace'
    },
    {
      module: 'Notes',
      action: 'View Notes File',
      route: 'notes/:workspace/:subject/file/:id'
    },
    {
      module: 'Notes',
      action: 'View Notes Subject',
      route: 'notes/:workspace/:subject/*'
    },
    { module: 'Notes', action: 'Create Note', route: 'notes/new' },
    {
      module: 'Books Library',
      action: 'View Books Library',
      route: 'books-library'
    },
    { module: 'Books Library', action: 'Add Book', route: 'books-library/new' }
  ],
  Finance: [
    { module: 'Wallet', action: 'View Wallet Balance', route: 'balance' },
    {
      module: 'Wallet',
      action: 'View Wallet Transactions',
      route: 'transactions'
    },
    { module: 'Wallet', action: 'View Wallet Budgets', route: 'budgets' },
    { module: 'Wallet', action: 'View Wallet Reports', route: 'reports' },
    {
      module: 'Wallet',
      action: 'Create Transaction',
      route: 'transactions/new'
    },
    { module: 'Wish List', action: 'View Wish List', route: 'wish-list' },
    { module: 'Wish List', action: 'Add to Wish List', route: 'wish-list/new' }
  ],
  Confidential: [
    { module: 'Contacts', action: 'View Contacts', route: 'contacts' },
    { module: 'Contacts', action: 'Add Contact', route: 'contacts/new' },
    { module: 'Passwords', action: 'View Passwords', route: 'passwords' },
    { module: 'Passwords', action: 'Add Password', route: 'passwords/new' },
    { module: 'Journal', action: 'View Journal', route: 'journal' },
    {
      module: 'Journal',
      action: 'View Journal Entry',
      route: 'journal/view/:id'
    },
    {
      module: 'Journal',
      action: 'Edit Journal Entry',
      route: 'journal/edit/:id'
    },
    { module: 'Journal', action: 'Create Journal Entry', route: 'journal/new' }
  ],
  Settings: [
    {
      module: 'Personalization',
      action: 'View Personalization Settings',
      route: 'personalization'
    },
    { module: 'Modules', action: 'View Modules', route: 'modules' },
    { module: 'Data Backup', action: 'View Data Backup', route: 'data-backup' },
    {
      module: 'Server Status',
      action: 'View Server Status',
      route: 'server-status'
    }
  ],
  Miscellaneous: [
    { module: 'Change Log', action: 'View Change Log', route: 'change-log' },
    { module: 'About', action: 'View About', route: 'about' }
  ]
}
