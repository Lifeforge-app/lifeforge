import generate from '@babel/generator'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import fs from 'fs'
import path from 'path'

import initRouteAndSchemaFiles from '@/utils/initRouteAndSchemaFiles'
import CLILoggingService from '@/utils/logging'

import { AST_GENERATION_OPTIONS } from './constants'

/**
 * Schema injection utilities for server configuration
 */

/**
 * Injects a module's schema import into the schema.ts file
 */
export function injectModuleSchema(moduleName: string): void {
  const { schemaPath } = initRouteAndSchemaFiles()

  if (!fs.existsSync(schemaPath)) {
    CLILoggingService.warn(`Schema config file not found at ${schemaPath}`)

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

  const schemaContent = fs.readFileSync(schemaPath, 'utf8')

  try {
    const ast = parse(schemaContent, {
      sourceType: 'module',
      plugins: ['typescript']
    })

    let schemasObjectPath: any = null

    // Find the SCHEMAS object
    traverse(ast, {
      VariableDeclarator(path) {
        if (
          t.isIdentifier(path.node.id, { name: 'SCHEMAS' }) &&
          t.isObjectExpression(path.node.init)
        ) {
          schemasObjectPath = path.get('init')
        }
      }
    })

    if (schemasObjectPath && t.isObjectExpression(schemasObjectPath.node)) {
      // Convert module name to snake_case for the key
      const snakeCaseModuleName = moduleName
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '')

      // Check if module is already imported
      const hasExistingProperty = schemasObjectPath.node.properties.some(
        (prop: any) =>
          t.isObjectProperty(prop) &&
          t.isIdentifier(prop.key) &&
          prop.key.name === snakeCaseModuleName
      )

      if (!hasExistingProperty) {
        const moduleImport = t.awaitExpression(
          t.callExpression(t.import(), [
            t.stringLiteral(`@lib/${moduleName}/server/schema`)
          ])
        )

        const memberExpression = t.memberExpression(
          moduleImport,
          t.identifier('default')
        )

        const newProperty = t.objectProperty(
          t.identifier(snakeCaseModuleName),
          memberExpression
        )

        schemasObjectPath.node.properties.push(newProperty)
      }
    }

    const { code } = generate(ast, AST_GENERATION_OPTIONS)

    fs.writeFileSync(schemaPath, code)

    CLILoggingService.info(
      `Injected schema for module "${moduleName}" into ${schemaPath}`
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
  const { schemaPath } = initRouteAndSchemaFiles()

  if (!fs.existsSync(schemaPath)) {
    CLILoggingService.warn(`Schema config file not found at ${schemaPath}`)

    return
  }

  const schemaContent = fs.readFileSync(schemaPath, 'utf8')

  try {
    const ast = parse(schemaContent, {
      sourceType: 'module',
      plugins: ['typescript']
    })

    let modified = false

    // Find and remove the module property from the SCHEMAS object
    traverse(ast, {
      VariableDeclarator(path) {
        if (
          t.isIdentifier(path.node.id, { name: 'SCHEMAS' }) &&
          t.isObjectExpression(path.node.init)
        ) {
          const objectExpression = path.node.init

          const originalLength = objectExpression.properties.length

          // Convert module name to snake_case for the key
          const snakeCaseModuleName = moduleName
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '')

          objectExpression.properties = objectExpression.properties.filter(
            (prop: any) => {
              if (
                t.isObjectProperty(prop) &&
                t.isIdentifier(prop.key) &&
                (prop.key.name === snakeCaseModuleName ||
                  (t.isAwaitExpression(prop.value) &&
                    t.isCallExpression(prop.value.argument) &&
                    t.isImport(prop.value.argument.callee) &&
                    prop.value.argument.arguments.length > 0 &&
                    t.isStringLiteral(prop.value.argument.arguments[0]) &&
                    prop.value.argument.arguments[0].value.includes(
                      moduleName
                    )))
              ) {
                return false // Remove this property
              }

              return true // Keep other properties
            }
          )

          if (objectExpression.properties.length < originalLength) {
            modified = true
          }
        }
      }
    })

    if (modified) {
      const { code } = generate(ast, AST_GENERATION_OPTIONS)

      fs.writeFileSync(schemaPath, code)

      CLILoggingService.info(
        `Removed schema for module "${moduleName}" from ${schemaPath}`
      )
    } else {
      CLILoggingService.info(
        `No schema found for module "${moduleName}" in ${schemaPath}`
      )
    }
  } catch (error) {
    CLILoggingService.error(
      `Failed to remove schema for module "${moduleName}": ${error}`
    )
  }
}
