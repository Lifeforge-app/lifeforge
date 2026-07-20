import * as ts from '@typescript/typescript6'
import fs from 'fs'

import { WidgetConfig } from './schemas'

function parseObjectLiteral(
  node: ts.ObjectLiteralExpression,
  sf: ts.SourceFile
): Record<string, string | number | boolean> {
  const obj: Record<string, string | number | boolean> = {}

  for (const property of node.properties) {
    if (ts.isPropertyAssignment(property)) {
      const name = property.name.getText(sf).replace(/['"]/g, '')
      const initializer = property.initializer

      if (
        ts.isStringLiteral(initializer) ||
        ts.isNoSubstitutionTemplateLiteral(initializer)
      ) {
        obj[name] = initializer.text
      } else if (ts.isNumericLiteral(initializer)) {
        obj[name] = Number(initializer.text)
      } else if (
        ts.isPrefixUnaryExpression(initializer) &&
        ts.isNumericLiteral(initializer.operand)
      ) {
        const operandVal = Number(initializer.operand.text)
        obj[name] =
          initializer.operator === ts.SyntaxKind.MinusToken
            ? -operandVal
            : operandVal
      } else if (initializer.kind === ts.SyntaxKind.TrueKeyword) {
        obj[name] = true
      } else if (initializer.kind === ts.SyntaxKind.FalseKeyword) {
        obj[name] = false
      }
    }
  }

  return obj
}

function findWidgetConfig(
  node: ts.Node,
  sourceFile: ts.SourceFile
): WidgetConfig | null {
  if (
    ts.isVariableDeclaration(node) &&
    node.name.getText(sourceFile) === 'config'
  ) {
    const initializer = node.initializer

    if (initializer && ts.isObjectLiteralExpression(initializer)) {
      return parseObjectLiteral(
        initializer,
        sourceFile
      ) as unknown as WidgetConfig
    }
  }

  let result: WidgetConfig | null = null

  ts.forEachChild(node, child => {
    const config = findWidgetConfig(child, sourceFile)

    if (config) {
      result = config
    }
  })

  return result
}

export default function parseWidgetConfig(
  filePath: string
): WidgetConfig | null {
  if (!fs.existsSync(filePath)) return null

  try {
    const sourceCode = fs.readFileSync(filePath, 'utf-8')
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    )

    return findWidgetConfig(sourceFile, sourceFile)
  } catch (error) {
    console.error(`Failed to parse widget config for ${filePath}:`, error)

    return null
  }
}
