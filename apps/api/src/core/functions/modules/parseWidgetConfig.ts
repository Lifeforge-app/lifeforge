import * as ts from '@typescript/typescript6'
import fs from 'fs'

import resolveExpressionMap, { findVariableDeclaration } from './ast-utils'
import { moduleLoaderLogger } from './moduleRegistry'
import { type WidgetConfig, widgetConfigSchema } from './schemas'

export default function parseWidgetConfig(
  filePath: string
): WidgetConfig | null {
  if (!fs.existsSync(filePath)) return null

  try {
    const sourceFile = ts.createSourceFile(
      filePath,
      fs.readFileSync(filePath, 'utf-8'),
      ts.ScriptTarget.Latest,
      true
    )

    const config = findVariableDeclaration(sourceFile, 'config')

    if (!config) return null

    return widgetConfigSchema.parse(resolveExpressionMap(config))
  } catch (error) {
    moduleLoaderLogger.error(
      `Failed to parse widget config for ${filePath}: ${error}`
    )

    return null
  }
}
