import chalk from 'chalk'
import fs from 'fs'
import Handlebars from 'handlebars'
import _ from 'lodash'
import prompts from 'prompts'
import z from 'zod'

import { AVAILABLE_TEMPLATE_MODULE_TYPES } from '../../../constants/constants'
import { fetchAI } from '../../../utils/ai'
import {
  checkRunningPBInstances,
  executeCommand,
  killExistingProcess,
  validateEnvironment
} from '../../../utils/helpers'
import { CLILoggingService } from '../../../utils/logging'
import {
  runDatabaseMigrations,
  startPocketBaseAndGetPid
} from '../../db-commands/functions/database-initialization'
import { validatePocketBaseSetup } from '../../db-commands/utils'
import { getInstalledModules } from '../utils/file-system'
import { injectModuleRoute } from '../utils/route-injection'
import { injectModuleSchema } from '../utils/schema-injection'
import selectIcon from '../utils/select-icon'

Handlebars.registerHelper('kebab', _.kebabCase)
Handlebars.registerHelper('pascal', (str: string) =>
  _.startCase(str).replace(/ /g, '')
)
Handlebars.registerHelper('camel', _.camelCase)
Handlebars.registerHelper('snake', _.snakeCase)

type ModuleMetadata = {
  moduleName: {
    en: string
    ms: string
    zhCN: string
    zhTW: string
  }
  moduleIcon: string
  moduleDesc: {
    en: string
    ms: string
    zhCN: string
    zhTW: string
  }
  moduleType: keyof typeof AVAILABLE_TEMPLATE_MODULE_TYPES
  moduleCategory: string
}

async function promptForModuleName(moduleName?: string): Promise<{
  en: string
  ms: string
  zhCN: string
  zhTW: string
}> {
  if (!moduleName) {
    const availableModules = getInstalledModules()

    const response = await prompts(
      {
        type: 'text',
        name: 'moduleName',
        message: 'Enter the name of the module to create:',
        validate: value => {
          if (!value || value.trim() === '') {
            return 'Module name cannot be empty'
          }

          if (availableModules.includes(value.trim())) {
            return `Module "${value.trim()}" already exists. Please uninstall it, or choose a different name.`
          }

          return true
        }
      },
      {
        onCancel: () => {
          CLILoggingService.error('Module creation cancelled by user.')
          process.exit(0)
        }
      }
    )

    moduleName = response.moduleName
  }

  const translationResponse = await fetchAI({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert translator that translates names into concise and clear languages. Given a name, translate it into Malay, Chinese (Simplified), and Chinese (Traditional). Translate only the name without adding any additional text.'
      },
      {
        role: 'user',
        content: `Translate the following module name into Malay, Chinese (Simplified), and Chinese (Traditional): "${moduleName!.trim()}"`
      }
    ],
    model: 'gpt-4o-mini',
    structure: z.object({
      ms: z.string().min(1),
      zhCN: z.string().min(1),
      zhTW: z.string().min(1)
    })
  })

  if (!translationResponse) {
    CLILoggingService.warn(
      "Failed to translate module name. Please edit it manually in the module's localization files."
    )

    return {
      en: moduleName!.trim(),
      ms: moduleName!.trim(),
      zhCN: moduleName!.trim(),
      zhTW: moduleName!.trim()
    }
  }

  for (const [key, value] of Object.entries(translationResponse)) {
    CLILoggingService.debug(`Translated module name [${key}]: ${value}`)
  }

  return {
    en: moduleName!.trim(),
    ...translationResponse
  }
}

async function promptModuleType(): Promise<
  keyof typeof AVAILABLE_TEMPLATE_MODULE_TYPES
> {
  const response = await prompts(
    {
      type: 'select',
      name: 'moduleType',
      message: 'Select the type of module to create:',
      choices: Object.entries(AVAILABLE_TEMPLATE_MODULE_TYPES).map(
        ([value, title]) => ({
          title: `${title} ${chalk.dim(`(${value})`)}`,
          value
        })
      )
    },
    {
      onCancel: () => {
        CLILoggingService.error('Module creation cancelled by user.')
        process.exit(0)
      }
    }
  )

  return response.moduleType
}

function checkModuleTypeAvailability(
  moduleType: keyof typeof AVAILABLE_TEMPLATE_MODULE_TYPES
): void {
  const templateDir = `${process.cwd()}/tools/forgeCLI/src/templates/${moduleType}`

  if (!fs.existsSync(templateDir)) {
    CLILoggingService.error(
      `Template for module type "${moduleType}" does not exist at path: ${templateDir}`
    )
    process.exit(1)
  }

  CLILoggingService.debug(
    `Template for module type "${moduleType}" found at path: ${templateDir}`
  )

  // Check if the directory is not empty
  const files = fs.readdirSync(templateDir)

  if (files.length === 0) {
    CLILoggingService.error(
      `Template directory for module type "${moduleType}" is empty at path: ${templateDir}`
    )
    process.exit(1)
  }

  CLILoggingService.debug(
    `Template for module type "${moduleType}" is available and ready to use.`
  )
}

/**
 * Prompts the user for a module description
 */
async function promptModuleDescription(): Promise<{
  en: string
  ms: string
  zhCN: string
  zhTW: string
}> {
  const response = await prompts(
    {
      type: 'text',
      name: 'moduleDescription',
      message: 'Enter a brief description for the module:',
      validate: value => {
        if (!value || value.trim() === '') {
          return 'Module description cannot be empty'
        }

        return true
      }
    },
    {
      onCancel: () => {
        CLILoggingService.error('Module creation cancelled by user.')
        process.exit(0)
      }
    }
  )

  const translationResponse = await fetchAI({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert translator that translates descriptions into concise and clear languages. Given a description, translate it into Malay, Chinese (Simplified), and Chinese (Traditional). Translate only the description without adding any additional text.'
      },
      {
        role: 'user',
        content: `Translate the following module description into Malay, Chinese (Simplified), and Chinese (Traditional): "${response.moduleDescription.trim()}"`
      }
    ],
    model: 'gpt-4o-mini',
    structure: z.object({
      ms: z.string().min(1),
      zhCN: z.string().min(1),
      zhTW: z.string().min(1)
    })
  })

  if (!translationResponse) {
    CLILoggingService.warn(
      "Failed to translate description. Please edit it manually in the module's localization files."
    )

    return {
      en: response.moduleDescription.trim(),
      ms: response.moduleDescription.trim(),
      zhCN: response.moduleDescription.trim(),
      zhTW: response.moduleDescription.trim()
    }
  }

  for (const [key, value] of Object.entries(translationResponse)) {
    CLILoggingService.debug(`Translated module description [${key}]: ${value}`)
  }

  return {
    en: _.upperFirst(response.moduleDescription.trim()),
    ...translationResponse
  }
}

async function promptModuleCategory(): Promise<string> {
  const response = await prompts(
    {
      type: 'text',
      name: 'moduleCategory',
      message:
        'Enter the category for the module (e.g., Lifestyle, Productivity, Utilities):',
      validate: value => {
        if (!value || value.trim() === '') {
          return 'Module category cannot be empty'
        }

        return true
      }
    },
    {
      onCancel: () => {
        CLILoggingService.error('Module creation cancelled by user.')
        process.exit(0)
      }
    }
  )

  return response.moduleCategory.trim()
}

function copyFileAndTemplateRenderRecursive(
  src: string,
  dest: string,
  context: ModuleMetadata
): void {
  const entries = fs.readdirSync(src, { withFileTypes: true })

  const finalContext = { ...context, curlyOpen: '{', curlyClose: '}' }

  entries.forEach(entry => {
    const srcPath = `${src}/${entry.name}`

    let destPath = `${dest}/${entry.name}`

    // Render the destination path as a template
    const template = Handlebars.compile(destPath)

    destPath = template(finalContext)

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath)
      copyFileAndTemplateRenderRecursive(srcPath, destPath, finalContext)
    } else {
      const fileContent = fs.readFileSync(srcPath, 'utf-8')

      // Render the file content as a template
      const contentTemplate = Handlebars.compile(fileContent)

      const renderedContent = contentTemplate(context)

      fs.writeFileSync(destPath, renderedContent, 'utf-8')
    }
  })
}

function renameTsConfigFile(moduleDir: string): void {
  if (fs.existsSync(`${moduleDir}/client/_tsconfig.json`)) {
    fs.renameSync(
      `${moduleDir}/client/_tsconfig.json`,
      `${moduleDir}/client/tsconfig.json`
    )
  }

  if (fs.existsSync(`${moduleDir}/server/_tsconfig.json`)) {
    fs.renameSync(
      `${moduleDir}/server/_tsconfig.json`,
      `${moduleDir}/server/tsconfig.json`
    )
  }
}

function copyTemplateFiles(moduleMetadata: ModuleMetadata): void {
  CLILoggingService.step(`Creating module "${moduleMetadata.moduleName.en}"...`)

  const templateDir = `${process.cwd()}/tools/forgeCLI/src/templates/${moduleMetadata.moduleType}`

  const destinationDir = `${process.cwd()}/apps/${_.camelCase(moduleMetadata.moduleName.en)}`

  fs.mkdirSync(destinationDir)

  copyFileAndTemplateRenderRecursive(
    templateDir,
    destinationDir,
    moduleMetadata
  )

  renameTsConfigFile(destinationDir)

  CLILoggingService.success(
    `Module "${moduleMetadata.moduleName.en}" created successfully at ${destinationDir}`
  )
}

function initializeGitRepository(modulePath: string): void {
  CLILoggingService.step('Initializing git repository for the new module...')

  executeCommand('git init', { cwd: modulePath, stdio: 'ignore' })
  executeCommand('git add .', { cwd: modulePath, stdio: 'ignore' })
  executeCommand('git commit -m "feat: initial commit"', {
    cwd: modulePath,
    stdio: 'ignore'
  })
}

function installDependencies(): void {
  CLILoggingService.step('Installing module dependencies...')

  executeCommand('bun install', {
    cwd: `${process.cwd()}/apps`,
    stdio: 'ignore'
  })

  CLILoggingService.success('Module dependencies installed successfully.')
}

async function generateDatabaseSchemas(): Promise<void> {
  CLILoggingService.step('Generating database schemas for the new module...')

  validateEnvironment([
    'PB_DIR',
    'PB_HOST',
    'PB_EMAIL',
    'PB_PASSWORD',
    'MASTER_KEY'
  ])

  const pbRunning = checkRunningPBInstances(false)

  let pbPid: number

  if (!pbRunning) {
    const { pbInstancePath } = await validatePocketBaseSetup(
      process.env.PB_DIR!
    )

    pbPid = await startPocketBaseAndGetPid(pbInstancePath)
  }

  executeCommand('bun run forge db generate-schemas', {
    cwd: process.cwd(),
    stdio: 'ignore'
  })

  CLILoggingService.success('Database schemas generated successfully.')

  if (!pbRunning) {
    killExistingProcess(pbPid!)
  }
}

/**
 * Handles the create module command
 */
export async function createModuleHandler(moduleName?: string): Promise<void> {
  const { pbInstancePath } = await validatePocketBaseSetup(process.env.PB_DIR!)

  const moduleNameWithTranslation = await promptForModuleName(moduleName)

  const moduleType = await promptModuleType()

  checkModuleTypeAvailability(moduleType)

  const moduleIcon = await selectIcon()

  const moduleDesc = await promptModuleDescription()

  const moduleCategory = await promptModuleCategory()

  const moduleMetadata: ModuleMetadata = {
    moduleName: moduleNameWithTranslation,
    moduleIcon,
    moduleDesc,
    moduleType,
    moduleCategory
  }

  const camelizedModuleName = _.camelCase(moduleMetadata.moduleName.en)

  copyTemplateFiles(moduleMetadata)

  initializeGitRepository(`${process.cwd()}/apps/${camelizedModuleName}`)

  installDependencies()

  injectModuleRoute(camelizedModuleName)
  injectModuleSchema(camelizedModuleName)

  runDatabaseMigrations(pbInstancePath)
  await generateDatabaseSchemas()

  CLILoggingService.success(
    `Module "${moduleMetadata.moduleName.en}" setup is complete!`
  )
}
