import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import { resolveLocale } from '../functions/listLocales'

const localesPackageJSONSchema = z.object({
  name: z.string().regex(/^@lifeforge\/.+--lang-.+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string(),
  author: z.string(),
  repository: z
    .object({
      type: z.literal('git'),
      url: z.string()
    })
    .optional(),
  lifeforge: z.object({
    code: z.string(),
    displayName: z.string(),
    icon: z.string(),
    alternative: z.array(z.string()).optional()
  })
})

export function validateLocaleStructureHandler(lang: string) {
  const mod = resolveLocale(lang)

  if (!mod) {
    log.error(`Locale "${lang}" not found in locales/`)

    process.exit(1)
  }

  const targetDir = mod.dir

  const packageJsonPath = path.join(targetDir, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    log.error(`Locale "${lang}" is missing package.json`)

    process.exit(1)
  }

  const packageJson = z.safeParse(
    localesPackageJSONSchema,
    JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  )

  if (!packageJson.success) {
    log.error('Locale validation failed:')
    packageJson.error.issues.forEach(issue => log.error(`  - ${issue.message}`))

    process.exit(1)
  }

  const folderContents = fs
    .readdirSync(targetDir)
    .filter(file => !['package.json', '.git'].includes(file))

  if (
    !folderContents.every(
      file =>
        fs.statSync(path.join(targetDir, file)).isFile() &&
        file.endsWith('.json')
    )
  ) {
    log.error(`Locale "${lang}" contains non-JSON files`)

    process.exit(1)
  }

  for (const file of folderContents) {
    const filePath = path.join(targetDir, file)

    try {
      JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch {
      log.error(`Locale "${lang}" contains invalid JSON files "${file}"`)

      process.exit(1)
    }
  }

  log.success(`Locale ${chalk.blue(lang)} is valid`)
}
