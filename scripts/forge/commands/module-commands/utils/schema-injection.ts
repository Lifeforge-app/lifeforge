import generate from '@babel/generator'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import fs from 'fs'
import path from 'path'

import { CLILoggingService } from '../../../utils/logging'
import { AST_GENERATION_OPTIONS, SERVER_CONFIG } from './constants'

/**
 * Schema injection utilities for server configuration
 */

/**
 * Injects a module's schema import into the schema.ts file
 */
export function injectModuleSchema(moduleName: string): void {
  const schemaConfigPath = path.resolve(SERVER_CONFIG.SCHEMA_FILE)

  if (!fs.existsSync(schemaConfigPath)) {
    CLILoggingService.warn(
      `Schema config file not found at ${schemaConfigPath}`
    )
    return
  }

  // Check if module has a schema file first
  const moduleSchemaPath = path.resolve(`apps/${moduleName}/server/schema.ts`)
  if (!fs.existsSync(moduleSchemaPath)) {
    CLILoggingService.info(
      `No schema file found for module "${moduleName}", skipping schema injection`
    )
    return
  }

  const schemaContent = fs.readFileSync(schemaConfigPath, 'utf8')

  try {
    const ast = parse(schemaContent, {
      sourceType: 'module',
      plugins: ['typescript']
    })

    let arrayExpressionPath: any = null

    // Find the array expression in the exported default
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        if (t.isArrayExpression(path.node.declaration)) {
          arrayExpressionPath = path.get('declaration')
        }
      }
    })

    if (arrayExpressionPath && t.isArrayExpression(arrayExpressionPath.node)) {
      // Check if module is already imported
      const hasExistingImport = arrayExpressionPath.node.elements.some(
        (element: any) =>
          t.isAwaitExpression(element) &&
          t.isCallExpression(element.argument) &&
          t.isImport(element.argument.callee) &&
          element.argument.arguments.length > 0 &&
          t.isStringLiteral(element.argument.arguments[0]) &&
          element.argument.arguments[0].value.includes(moduleName)
      )

      if (!hasExistingImport) {
        const moduleImport = t.awaitExpression(
          t.callExpression(t.import(), [
            t.stringLiteral(`@lib/${moduleName}/server/schema`)
          ])
        )
        arrayExpressionPath.node.elements.push(moduleImport)
      }
    }

    const { code } = generate(ast, AST_GENERATION_OPTIONS)
    fs.writeFileSync(schemaConfigPath, code)

    CLILoggingService.info(
      `Injected schema for module "${moduleName}" into ${SERVER_CONFIG.SCHEMA_FILE}`
    )
  } catch (error) {
    CLILoggingService.error(
      `Failed to inject schema for module "${moduleName}": ${error}`
    )
  }
}

/**
 * Removes a module's schema from the schema.ts file
 */
export function removeModuleSchema(moduleName: string): void {
  const schemaConfigPath = path.resolve(SERVER_CONFIG.SCHEMA_FILE)

  if (!fs.existsSync(schemaConfigPath)) {
    CLILoggingService.warn(
      `Schema config file not found at ${schemaConfigPath}`
    )
    return
  }

  const schemaContent = fs.readFileSync(schemaConfigPath, 'utf8')

  try {
    const ast = parse(schemaContent, {
      sourceType: 'module',
      plugins: ['typescript']
    })

    let modified = false

    // Find and remove the module import from the array
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        if (t.isArrayExpression(path.node.declaration)) {
          const arrayExpression = path.node.declaration
          const originalLength = arrayExpression.elements.length

          arrayExpression.elements = arrayExpression.elements.filter(
            (element: any) => {
              if (
                t.isAwaitExpression(element) &&
                t.isCallExpression(element.argument) &&
                t.isImport(element.argument.callee) &&
                element.argument.arguments.length > 0 &&
                t.isStringLiteral(element.argument.arguments[0]) &&
                element.argument.arguments[0].value.includes(moduleName)
              ) {
                return false // Remove this import
              }
              return true // Keep other imports
            }
          )

          if (arrayExpression.elements.length < originalLength) {
            modified = true
          }
        }
      }
    })

    if (modified) {
      const { code } = generate(ast, AST_GENERATION_OPTIONS)
      fs.writeFileSync(schemaConfigPath, code)

      CLILoggingService.info(
        `Removed schema for module "${moduleName}" from ${SERVER_CONFIG.SCHEMA_FILE}`
      )
    } else {
      CLILoggingService.info(
        `No schema found for module "${moduleName}" in ${SERVER_CONFIG.SCHEMA_FILE}`
      )
    }
  } catch (error) {
    CLILoggingService.error(
      `Failed to remove schema for module "${moduleName}": ${error}`
    )
  }
}
