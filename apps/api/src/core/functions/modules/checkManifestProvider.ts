import * as ts from '@typescript/typescript6'
import fs from 'fs'

import { findNode, parseObjectLiteral } from './ast-utils'
import { moduleLoaderLogger } from './moduleRegistry'

/**
 * Checks if a module's manifest file has a provider defined by looking
 * for a `provider` property in the `createForgeModuleClient(...)` call.
 *
 * @param filePath - Path to the manifest file.
 * @returns Whether the manifest has a provider.
 */
export default function checkManifestProvider(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false

  try {
    const sourceCode = fs.readFileSync(filePath, 'utf-8')
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    )

    // Find `createForgeModuleClient()` in the code
    const callExpr = findNode(
      sourceFile,
      n =>
        ts.isCallExpression(n) &&
        n.expression.getText(sourceFile) === 'createForgeModuleClient'
    )

    if (!callExpr) return false

    // Get the first argument inside the `createForgeModuleClient`
    const arg = (callExpr as ts.CallExpression).arguments[0]

    // Ensure the first argument is an object
    if (!arg || !ts.isObjectLiteralExpression(arg)) return false

    // See if the object contains the key `provider`
    return 'provider' in parseObjectLiteral(arg)
  } catch (error) {
    moduleLoaderLogger.error(
      `Failed to parse manifest AST for ${filePath}: ${error}`
    )

    return false
  }
}
