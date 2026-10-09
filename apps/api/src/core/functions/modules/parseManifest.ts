import * as ts from '@typescript/typescript6'
import fs from 'fs'
import path from 'path'

import { type WidgetConfig } from '@lifeforge/configs'

import resolveExpressionMap, { findNode, parseObjectLiteral } from './ast-utils'
import { moduleLoaderLogger } from './moduleLoaderLogger'
import parseWidgetConfig from './parseWidgetConfig'

export interface ParsedSubsection {
  label: string
  icon: string
  path: string
}

export interface ParsedWidget {
  filePath: string
  config: WidgetConfig
}

export interface ParsedManifest {
  hasProvider: boolean
  hidden?: boolean
  subsection?: ParsedSubsection[]
  widgets: ParsedWidget[]
}

function findImportPath(node: ts.Node): string | null {
  if (
    ts.isCallExpression(node) &&
    node.expression.kind === ts.SyntaxKind.ImportKeyword &&
    node.arguments.length > 0
  ) {
    const arg = node.arguments[0]

    if (
      arg &&
      (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg))
    ) {
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

function parseSubsections(
  properties: Record<string, ts.Expression>
): ParsedSubsection[] | undefined {
  const subsectionExpr = properties['subsection']

  if (!subsectionExpr || !ts.isArrayLiteralExpression(subsectionExpr)) {
    return undefined
  }

  const subsections: ParsedSubsection[] = []

  for (const element of subsectionExpr.elements) {
    if (ts.isObjectLiteralExpression(element)) {
      const resolved = resolveExpressionMap(parseObjectLiteral(element))

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
}

function parseWidgets(
  properties: Record<string, ts.Expression>,
  manifestPath: string
): ParsedWidget[] {
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
}

/**
 * Parses a module's manifest file in a single pass, extracting the
 * `provider`, `hidden`, `subsection`, and `widgets` metadata from the
 * `createForgeModule(...)` call.
 *
 * @param manifestPath - Path to the module's client manifest file.
 * @returns The parsed manifest metadata.
 */
export default function parseManifest(manifestPath: string): ParsedManifest {
  const empty: ParsedManifest = {
    hasProvider: false,
    widgets: []
  }

  if (!fs.existsSync(manifestPath)) return empty

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

    if (!callExpr) return empty

    const arg = (callExpr as ts.CallExpression).arguments[0]

    if (!arg || !ts.isObjectLiteralExpression(arg)) return empty

    const properties = parseObjectLiteral(arg)
    const resolved = resolveExpressionMap(properties)

    return {
      hasProvider: 'provider' in properties,
      hidden:
        typeof resolved.hidden === 'boolean' ? resolved.hidden : undefined,
      subsection: parseSubsections(properties),
      widgets: parseWidgets(properties, manifestPath)
    }
  } catch (error) {
    moduleLoaderLogger.error(
      `Failed to parse manifest AST for ${manifestPath}: ${error}`
    )

    return empty
  }
}
