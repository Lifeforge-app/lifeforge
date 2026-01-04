import fs from 'fs'
import path from 'path'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import Logging from '@/utils/logging'
import { checkPackageExists } from '@/utils/registry'

import getFsMetadata from '../functions/getFsMetadata'
import installModulePackage from '../functions/installModulePackage'
import linkModuleToWorkspace from '../functions/linkModuleToWorkspace'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'
import generateServerRegistry from '../functions/registry/generateServerRegistry'

export async function installModuleHandler(moduleName: string): Promise<void> {
  const { fullName, shortName, targetDir } = getFsMetadata(moduleName)

  if (fs.existsSync(targetDir)) {
    Logging.actionableError(
      `Module already exists at apps/${shortName}`,
      `Remove it first with: bun forge modules remove ${shortName}`
    )

    return
  }

  if (!(await checkPackageExists(fullName))) {
    Logging.actionableError(
      `Module ${fullName} does not exist`,
      `Check the module name and try again`
    )

    return
  }

  installModulePackage(fullName, targetDir)

  linkModuleToWorkspace(fullName)

  generateServerRegistry()

  generateSchemaRegistry()

  if (fs.existsSync(path.join(targetDir, 'server', 'schema.ts'))) {
    generateMigrationsHandler(moduleName)
  }
}
