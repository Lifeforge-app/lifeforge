import { execSync } from 'child_process'
import { program } from 'commander'
import fs from 'fs'
import path from 'path'

const TOOLS_DIR = path.join(__dirname, '../tools')

const PROCESS_ALLOWED = ['build', 'dev', 'types', 'lint'] as const

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

type ProcessType = (typeof PROCESS_ALLOWED)[number]
type ProjectType = keyof typeof PROJECTS_ALLOWED

function executeCommand(
  processType: ProcessType,
  projects: ProjectType[]
): void {
  const isAll = projects.includes('all' as ProjectType)

  const finalProjects = isAll
    ? (Object.keys(PROJECTS_ALLOWED) as ProjectType[])
    : projects

  const commands = finalProjects.map(
    projectType =>
      `cd ${PROJECTS_ALLOWED[projectType]} && bun run ${processType}`
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
}

program
  .name('Lifeforge Forge')
  .description('Build and manage Lifeforge projects')
  .version('25w41')

// Add individual commands for each process type
for (const processType of PROCESS_ALLOWED) {
  program
    .command(processType)
    .description(`Run ${processType} for specified projects`)
    .argument(
      '<projects...>',
      `Project names to run ${processType} on. Use 'all' for all projects. Available: all, ${Object.keys(PROJECTS_ALLOWED).join(', ')}`
    )
    .action((projects: string[]) => {
      // Validate projects
      const validProjects = [...Object.keys(PROJECTS_ALLOWED), 'all']

      const invalidProjects = projects.filter(
        project => !validProjects.includes(project)
      )

      if (invalidProjects.length > 0) {
        console.error(
          `Invalid project(s): ${invalidProjects.join(', ')}. Allowed projects are: all, ${Object.keys(PROJECTS_ALLOWED).join(', ')}`
        )
        process.exit(1)
      }

      executeCommand(processType, projects as ProjectType[])
    })
}

program.parse()
