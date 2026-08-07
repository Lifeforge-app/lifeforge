import * as ts from '@typescript/typescript6'
import fs from 'fs'
import path from 'path'

import { type WidgetConfig } from '@lifeforge/configs'

import { findNode, parseObjectLiteral } from './ast-utils'
import { moduleLoaderLogger } from './moduleLoaderLogger'
import parseWidgetConfig from './parseWidgetConfig'

export interface ParsedWidget {
  filePath: string
  config: WidgetConfig
}

function findImportPath(node: ts.Node): string | null {
  if (
    ts.isCallExpression(node) &&
    node.expression.kind === ts.SyntaxKind.ImportKeyword &&
    node.arguments.length > 0
  ) {
    const arg = node.arguments[0]
    if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) {
      return arg.text
    }
  }

  let foundPath: string | null = null
  ts.forEachChild(node, child => {
    if (!foundPath) {
      foundPath = findImportPath(child)
    }
  })

  return foundPath
}

function resolveWidgetFilePath(
  importPath: string,
  manifestDir: string
): string | null {
  let absolutePath = ''

  if (importPath.startsWith('@/')) {
    absolutePath = path.join(manifestDir, 'src', importPath.slice(2))
  } else {
    absolutePath = path.resolve(manifestDir, importPath)
  }

  const extensions = ['.tsx', '.ts', '/index.tsx', '/index.ts']
  for (const ext of extensions) {
    const fullPath = absolutePath + ext
    if (fs.existsSync(fullPath)) {
      return fullPath
    }
  }

  return null
}

export default function parseManifestWidgets(
  manifestPath: string
): ParsedWidget[] {
  if (!fs.existsSync(manifestPath)) return []

  try {
    const sourceCode = fs.readFileSync(manifestPath, 'utf-8')
    const sourceFile = ts.createSourceFile(
      manifestPath,
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

    if (!callExpr) return []

    const arg = (callExpr as ts.CallExpression).arguments[0]

    if (!arg || !ts.isObjectLiteralExpression(arg)) return []

    const properties = parseObjectLiteral(arg)
    const widgetsExpr = properties['widgets']

    if (!widgetsExpr || !ts.isArrayLiteralExpression(widgetsExpr)) {
      return []
    }

    const manifestDir = path.dirname(manifestPath)
    const widgets: ParsedWidget[] = []

    for (const element of widgetsExpr.elements) {
      const importPath = findImportPath(element)
      if (!importPath) continue

      const resolvedPath = resolveWidgetFilePath(importPath, manifestDir)
      if (!resolvedPath) continue

      const config = parseWidgetConfig(resolvedPath)
      if (config) {
        widgets.push({
          filePath: resolvedPath,
          config
        })
      }
    }

    return widgets
  } catch (error) {
    moduleLoaderLogger.error(
      `Failed to parse manifest widgets AST for ${manifestPath}: ${error}`
    )
    return []
  }
}
