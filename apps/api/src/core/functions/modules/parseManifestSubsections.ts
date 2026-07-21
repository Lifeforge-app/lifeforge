import * as ts from '@typescript/typescript6'
import fs from 'fs'

import resolveExpressionMap, { findNode, parseObjectLiteral } from './ast-utils'
import { moduleLoaderLogger } from './moduleRegistry'

export interface ParsedSubsection {
  label: string
  icon: string
  path: string
}

export default function parseManifestSubsections(
  filePath: string
): ParsedSubsection[] | undefined {
  if (!fs.existsSync(filePath)) return undefined

  try {
    const sourceCode = fs.readFileSync(filePath, 'utf-8')
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    )

    const callExpr = findNode(
      sourceFile,
      n =>
        ts.isCallExpression(n) &&
        n.expression.getText(sourceFile) === 'createForgeModule'
    )

    if (!callExpr) return undefined

    const arg = (callExpr as ts.CallExpression).arguments[0]

    if (!arg || !ts.isObjectLiteralExpression(arg)) return undefined

    const properties = parseObjectLiteral(arg)
    const subsectionExpr = properties['subsection']

    if (!subsectionExpr || !ts.isArrayLiteralExpression(subsectionExpr)) {
      return undefined
    }

    const subsections: ParsedSubsection[] = []

    for (const element of subsectionExpr.elements) {
      if (ts.isObjectLiteralExpression(element)) {
        const objProps = parseObjectLiteral(element)
        const resolved = resolveExpressionMap(objProps)

        if (
          typeof resolved.label === 'string' &&
          typeof resolved.icon === 'string' &&
          typeof resolved.path === 'string'
        ) {
          subsections.push({
            label: resolved.label,
            icon: resolved.icon,
            path: resolved.path
          })
        }
      }
    }

    return subsections.length > 0 ? subsections : undefined
  } catch (error) {
    moduleLoaderLogger.error(
      `Failed to parse manifest subsections AST for ${filePath}: ${error}`
    )

    return undefined
  }
}
