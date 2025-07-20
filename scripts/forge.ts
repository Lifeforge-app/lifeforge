import { execSync } from 'child_process'

const PROCESS_ALLOWED = ['build', 'dev', 'types']

const PROJECTS_ALLOWED = {
  client: 'client',
  server: 'server',
  shared: 'shared',
  ui: 'ui',
  'apps:localization-manager': 'apps/localization-manager',
  'apps:docs': 'apps/docs'
}

const processType = process.argv[2]
const projectType = process.argv[3]

if (!PROCESS_ALLOWED.includes(processType)) {
  console.error(
    `Invalid process type: ${processType}. Allowed types are: ${PROCESS_ALLOWED.join(', ')}`
  )
  process.exit(1)
}

if (!Object.keys(PROJECTS_ALLOWED).includes(projectType)) {
  console.error(
    `Invalid project type: ${projectType}. Allowed projects are: ${Object.keys(PROJECTS_ALLOWED).join(', ')}`
  )
  process.exit(1)
}

const command = `cd ${PROJECTS_ALLOWED[projectType]} && bun run ${processType}`
try {
  execSync(command, { stdio: 'inherit' })
  console.log(
    `${processType.charAt(0).toUpperCase() + processType.slice(1)} completed successfully for ${projectType}.`
  )
} catch (error) {
  console.error(
    `${processType.charAt(0).toUpperCase() + processType.slice(1)} failed for ${projectType}.`
  )
  console.error(error)
  process.exit(1)
}
