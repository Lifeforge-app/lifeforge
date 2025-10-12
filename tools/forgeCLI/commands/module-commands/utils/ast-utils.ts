import * as t from '@babel/types'

/**
 * AST manipulation utilities for Babel transformations
 */

/**
 * Creates a dynamic import expression for module loading
 */
export function createDynamicImport(modulePath: string): t.MemberExpression {
  const awaitImport = t.awaitExpression(
    t.callExpression(t.import(), [t.stringLiteral(modulePath)])
  )

  return t.memberExpression(awaitImport, t.identifier('default'))
}
