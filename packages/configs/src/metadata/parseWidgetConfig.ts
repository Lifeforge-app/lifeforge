import * as ts from '@typescript/typescript6'
import fs from 'fs'

import {
  type WidgetConfig,
  widgetConfigSchema
} from '../interfaces/widget.types'
import resolveExpressionMap, { findVariableDeclaration } from './ast-utils'

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
    console.error(`Failed to parse widget config for ${filePath}: ${error}`)

    return null
  }
}
