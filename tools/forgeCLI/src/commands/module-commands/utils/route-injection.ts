import generate from '@babel/generator'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import fs from 'fs'
import path from 'path'

import { CLILoggingService } from '../../../utils/logging'
import { createDynamicImport } from './ast-utils'
import { AST_GENERATION_OPTIONS, SERVER_CONFIG } from './constants'

/**
 * Route injection utilities for server configuration
 */

/**
 * Injects a module's server route import into the app.routes.ts file
 */
export function injectModuleRoute(moduleName: string): void {
  const routesConfigPath = path.resolve(SERVER_CONFIG.ROUTES_FILE)

  if (!fs.existsSync(routesConfigPath)) {
    CLILoggingService.warn(
      `Routes config file not found at ${routesConfigPath}`
    )

    return
  }

  const routesContent = fs.readFileSync(routesConfigPath, 'utf8')

  try {
    const ast = parse(routesContent, {
      sourceType: 'module',
      plugins: ['typescript']
    })

    let routerObjectPath: any = null

    // Find the forgeRouter call expression
    traverse(ast, {
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee, { name: 'forgeRouter' }) &&
          path.node.arguments.length > 0 &&
          t.isObjectExpression(path.node.arguments[0])
        ) {
          routerObjectPath = path.get('arguments')[0]
        }
      }
    })

    // Check if module already exists and add if not
    if (routerObjectPath && t.isObjectExpression(routerObjectPath.node)) {
      const hasExistingProperty = routerObjectPath.node.properties.some(
        (prop: any) =>
          t.isObjectProperty(prop) &&
          t.isIdentifier(prop.key) &&
          prop.key.name === moduleName
      )

      if (!hasExistingProperty) {
        const moduleImport = createDynamicImport(`@lib/${moduleName}/server`)

        const newProperty = t.objectProperty(
          t.identifier(moduleName),
          moduleImport
        )

        routerObjectPath.node.properties.push(newProperty)
      }
    }

    const { code } = generate(ast, AST_GENERATION_OPTIONS)

    fs.writeFileSync(routesConfigPath, code)

    CLILoggingService.info(
      `Injected route for module "${moduleName}" into ${SERVER_CONFIG.ROUTES_FILE}`
    )
  } catch (error) {
    CLILoggingService.error(
      `Failed to inject route for module "${moduleName}": ${error}`
    )
  }
}

/**
 * Removes a module's server route from the app.routes.ts file
 */
export function removeModuleRoute(moduleName: string): void {
  const routesConfigPath = path.resolve(SERVER_CONFIG.ROUTES_FILE)

  if (!fs.existsSync(routesConfigPath)) {
    CLILoggingService.warn(
      `Routes config file not found at ${routesConfigPath}`
    )

    return
  }

  const routesContent = fs.readFileSync(routesConfigPath, 'utf8')

  try {
    const ast = parse(routesContent, {
      sourceType: 'module',
      plugins: ['typescript']
    })

    let modified = false

    // Find and remove the module property from forgeRouter object
    traverse(ast, {
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee, { name: 'forgeRouter' }) &&
          path.node.arguments.length > 0 &&
          t.isObjectExpression(path.node.arguments[0])
        ) {
          const routerObject = path.node.arguments[0]

          const originalLength = routerObject.properties.length

          routerObject.properties = routerObject.properties.filter(
            (prop: any) => {
              if (
                t.isObjectProperty(prop) &&
                t.isIdentifier(prop.key) &&
                prop.key.name === moduleName
              ) {
                return false // Remove this property
              }

              return true // Keep other properties
            }
          )

          if (routerObject.properties.length < originalLength) {
            modified = true
          }
        }
      }
    })

    if (modified) {
      const { code } = generate(ast, AST_GENERATION_OPTIONS)

      fs.writeFileSync(routesConfigPath, code)

      CLILoggingService.info(
        `Removed route for module "${moduleName}" from ${SERVER_CONFIG.ROUTES_FILE}`
      )
    } else {
      CLILoggingService.info(
        `No route found for module "${moduleName}" in ${SERVER_CONFIG.ROUTES_FILE}`
      )
    }
  } catch (error) {
    CLILoggingService.error(
      `Failed to remove route for module "${moduleName}": ${error}`
    )
  }
}
