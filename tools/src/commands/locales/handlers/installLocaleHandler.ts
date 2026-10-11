import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'

import initGitRepository from '@/utils/initGitRepository'
import { installFromGithub } from '@/utils/installSource'
import { setLocked, verifyLocked } from '@/utils/moduleLock'
import normalizePackage from '@/utils/normalizePackage'
import { resolveEntry } from '@/utils/registryIndex'
import { withSpinner } from '@/utils/spinner'

import setFirstLangInDB from '../functions/setFirstLangInDB'

export async function installLocaleHandler(langCode: string): Promise<void> {
  const { fullName, shortName, targetDir } = normalizePackage(
    langCode,
    'locale'
  )

  if (!/^@lifeforge\/.*?-lang-[a-z]{2}(-[A-Z]{2})?$/i.test(fullName)) {
    log.error(
      `Invalid locale name: ${chalk.blue(langCode)}. Locale names should follow the format "xx" or "xx-XX", where "xx" is a two-letter language code and "XX" is a two-letter country code.`
    )
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    log.error(
      `Locale already exists at locales/${shortName}. Remove it first with: pnpm forge locales uninstall ${shortName}`
    )

    process.exit(1)
  }

  const entry = await resolveEntry('locales', shortName)

  if (!entry) {
    log.error(`Locale ${chalk.blue(shortName)} was not found in the registry`)
    process.exit(1)
  }

  const version = entry.latest
  const commitSha = entry.versions[version]

  if (!commitSha) {
    log.error(
      `Registry has no release commit for ${chalk.blue(shortName)}@${version}`
    )
    process.exit(1)
  }

  verifyLocked('locales', shortName, version, commitSha)

  try {
    await withSpinner(
      `Installing ${chalk.blue(fullName)} v${version}...`,
      async () => {
        await installFromGithub({
          kind: 'locales',
          id: shortName,
          entry,
          targetDir,
          version
        })

        initGitRepository(targetDir)

        await setFirstLangInDB(shortName)

        setLocked('locales', shortName, {
          repo: entry.repo,
          version,
          commitSha
        })
      },
      {
        success: `Installed ${chalk.blue(fullName)}`,
        fail: `Failed to install ${chalk.blue(fullName)}`
      }
    )
  } catch {
    process.exit(1)
  }
}
