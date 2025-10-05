import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const TOOLS_DIR = path.join(__dirname, '../tools')

const PROCESS_ALLOWED = ['build', 'dev', 'types', 'lint']

const PROJECTS_ALLOWED = Object.assign(
  {
    shared: 'shared',
    ui: 'packages/lifeforge-ui',
    client: 'client',
    server: 'server'
  },
  Object.fromEntries(
    fs
      .readdirSync(TOOLS_DIR)
      .filter(f => fs.statSync(path.join(TOOLS_DIR, f)).isDirectory())
      .map(f => [f, `tools/${f}`])
  )
)

const processType = process.argv[2]

const projectTypes = process.argv.slice(3)

if (!PROCESS_ALLOWED.includes(processType)) {
  console.error(
    `Invalid process type: ${processType}. Allowed types are: ${PROCESS_ALLOWED.join(', ')}`
  )
  process.exit(1)
}

if (projectTypes.length === 0) {
  console.error(
    `No project type specified. Allowed projects are: all, ${Object.keys(
      PROJECTS_ALLOWED
    ).join(', ')}`
  )
  process.exit(1)
}

if (
  JSON.stringify(projectTypes) !== '["all"]' &&
  !projectTypes.every(projectType =>
    Object.keys(PROJECTS_ALLOWED).includes(projectType)
  )
) {
  console.error(
    `Invalid project type: ${projectTypes.find(projectType => !Object.keys(PROJECTS_ALLOWED).includes(projectType))}. Allowed projects are: all, ${Object.keys(PROJECTS_ALLOWED).join(', ')}`
  )
  process.exit(1)
}

const isAll = JSON.stringify(projectTypes) === '["all"]'

const finalProjects = isAll ? Object.keys(PROJECTS_ALLOWED) : projectTypes

const commands = finalProjects.map(
  projectType =>
    `cd ${PROJECTS_ALLOWED[projectType as keyof typeof PROJECTS_ALLOWED]} && bun run ${processType}`
)

console.log(`Running ${processType} for ${finalProjects.length} projects...`)

for (const command of commands) {
  console.log(`Executing command: ${command}`)

  try {
    execSync(command, { stdio: 'inherit' })

    console.log(`Command completed: ${command}`)
  } catch {
    console.error(`Command failed: ${command}`)
    process.exit(1)
  }
}

console.log(`All projects ${processType} completed successfully.`)
process.exit(0)
