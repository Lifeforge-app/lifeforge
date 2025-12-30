import fs from 'fs'
import Handlebars from 'handlebars'
import _ from 'lodash'

import CLILoggingService from '@/utils/logging'

import { AVAILABLE_TEMPLATE_MODULE_TYPES } from '../../../../constants/constants'

export type ModuleMetadata = {
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

export function copyFileAndTemplateRenderRecursive(
  src: string,
  dest: string,
  context: ModuleMetadata
): void {
  const entries = fs.readdirSync(src, { withFileTypes: true })

  const finalContext = { ...context, curlyOpen: '{', curlyClose: '}' }

  entries.forEach(entry => {
    const srcPath = `${src}/${entry.name}`

    let destPath = `${dest}/${entry.name}`

    const template = Handlebars.compile(destPath)

    destPath = template(finalContext)

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath)
      copyFileAndTemplateRenderRecursive(srcPath, destPath, finalContext)
    } else {
      const fileContent = fs.readFileSync(srcPath, 'utf-8')

      const contentTemplate = Handlebars.compile(fileContent)

      const renderedContent = contentTemplate(context)

      fs.writeFileSync(destPath, renderedContent, 'utf-8')
    }
  })
}

export function renameTsConfigFile(moduleDir: string): void {
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

export function copyTemplateFiles(moduleMetadata: ModuleMetadata): void {
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
