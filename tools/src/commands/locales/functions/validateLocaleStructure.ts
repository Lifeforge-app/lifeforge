import fs from 'fs'
import path from 'path'
import z from 'zod'

import logger from '@/utils/logger'

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

export function validateLocaleStructure(localePath: string) {
  const packageJsonPath = path.join(localePath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    logger.actionableError(
      `Locale "${localePath}" is missing package.json`,
      'Run "bun forge locales list" to see available locales'
    )

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

  const folderName = path.basename(localePath)

  if (`@lifeforge/${folderName}` !== packageJson.data.name) {
    logger.actionableError(
      `The folder name "${folderName}" does not match the package name "${packageJson.data.name}"`,
      'Please make sure the folder name matches the package name'
    )

    process.exit(1)
  }

  const folderContents = fs
    .readdirSync(localePath)
    .filter(file => !['package.json', '.git'].includes(file))

  if (
    !folderContents.every(
      file =>
        fs.statSync(path.join(localePath, file)).isFile() &&
        file.endsWith('.json')
    )
  ) {
    logger.actionableError(
      `Locale "${folderName}" contains non-JSON files`,
      'Please make sure all files in the locale directory are JSON files'
    )

    process.exit(1)
  }

  for (const file of folderContents) {
    const filePath = path.join(localePath, file)

    try {
      JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch {
      logger.actionableError(
        `Locale "${folderName}" contains invalid JSON files "${file}"`,
        'Please make sure all files in the locale directory are valid JSON files'
      )

      process.exit(1)
    }
  }
}
