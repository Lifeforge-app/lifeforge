export { cloneModuleRepository } from './clone-repository'

export {
  removeGitModulesEntry,
  removeGitSubmodule,
  updateGitSubmodules
} from './git-submodule'

export { checkForUpdates, checkGitCleanliness } from './git-status'

export type { CommitInfo } from './git-status'

export {
  checkGithubCLI,
  createGithubRepo,
  replaceRepoWithSubmodule
} from './github-cli'
