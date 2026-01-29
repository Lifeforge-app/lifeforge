import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

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
  const { targetDir } = normalizePackage(lang, 'locale')

  if (!fs.existsSync(targetDir)) {
    logger.error(`Locale "${lang}" not found in locales/`)

    process.exit(1)
  }

  const packageJsonPath = path.join(targetDir, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    logger.error(`Locale "${lang}" is missing package.json`)

    process.exit(1)
  }

  const packageJson = z.safeParse(
    localesPackageJSONSchema,
    JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  )

  if (!packageJson.success) {
    logger.error('Locale validation failed:')
    packageJson.error.issues.forEach(issue =>
      logger.error(`  - ${issue.message}`)
    )

    process.exit(1)
  }

  if (`@lifeforge/${lang}` !== packageJson.data.name) {
    logger.error(
      `The folder name "${lang}" does not match the package name "${packageJson.data.name}"`
    )

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
    logger.error(`Locale "${lang}" contains non-JSON files`)

    process.exit(1)
  }

  for (const file of folderContents) {
    const filePath = path.join(targetDir, file)

    try {
      JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch {
      logger.error(`Locale "${lang}" contains invalid JSON files "${file}"`)

      process.exit(1)
    }
  }

  logger.success(`Locale ${chalk.blue(lang)} is valid`)
}
