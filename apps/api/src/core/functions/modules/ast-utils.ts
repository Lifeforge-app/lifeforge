import * as ts from '@typescript/typescript6'

/**
 * Reads the properties of an object from parsed code and returns them as a key-value map.
 * Only normal property assignments are included — shorthand or spread are skipped.
 *
 * @param node - The parsed object to read from.
 * @returns An object with property names as keys and their code values as entries.
 */
export function parseObjectLiteral(
  node: ts.ObjectLiteralExpression
): Record<string, ts.Expression> {
  const sf = node.getSourceFile()
  const obj: Record<string, ts.Expression> = {}

  for (const property of node.properties) {
    if (ts.isPropertyAssignment(property)) {
      const name = property.name.getText(sf).replace(/['"]/g, '')
      obj[name] = property.initializer
    }
  }

  return obj
}

/**
 * Searches through code to find the first piece that matches a condition.
 *
 * @param node - The code to search through.
 * @param predicate - A function that checks if a piece of code is what you're looking for.
 * @returns The matching piece of code, or `null` if not found.
 */
export function findNode(
  node: ts.Node,
  predicate: (node: ts.Node) => boolean
): ts.Node | null {
  if (predicate(node)) return node

  let result: ts.Node | null = null

  ts.forEachChild(node, child => {
    if (!result) {
      result = findNode(child, predicate)
    }
  })

  return result
}

/**
 * Looks through the code to find a variable with the given name
 * and returns its properties as a key-value object.
 *
 * @param node - The code to search through.
 * @param variableName - The name of the variable to find.
 * @returns An object of the variable's properties, or `null` if not found.
 */
export function findVariableDeclaration(
  node: ts.Node,
  variableName: string
): Record<string, ts.Expression> | null {
  const declaration = findNode(
    node,
    n =>
      ts.isVariableDeclaration(n) &&
      n.name.getText(n.getSourceFile()) === variableName
  )

  if (!declaration) return null

  const initializer = (declaration as ts.VariableDeclaration).initializer

  if (initializer && ts.isObjectLiteralExpression(initializer)) {
    return parseObjectLiteral(initializer)
  }

  return null
}

const expressionRules: {
  test: (expr: ts.Expression) => boolean
  parse: (expr: ts.Expression) => string | number | boolean
}[] = [
  {
    test: e => ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e),
    parse: e => (e as ts.StringLiteral | ts.NoSubstitutionTemplateLiteral).text
  },
  {
    test: e => ts.isNumericLiteral(e),
    parse: e => Number((e as ts.NumericLiteral).text)
  },
  {
    test: e =>
      ts.isPrefixUnaryExpression(e) &&
      ts.isNumericLiteral((e as ts.PrefixUnaryExpression).operand),
    parse: e => {
      const expr = e as ts.PrefixUnaryExpression
      const val = Number((expr.operand as ts.NumericLiteral).text)

      return expr.operator === ts.SyntaxKind.MinusToken ? -val : val
    }
  },
  {
    test: e => e.kind === ts.SyntaxKind.TrueKeyword,
    parse: () => true
  },
  {
    test: e => e.kind === ts.SyntaxKind.FalseKeyword,
    parse: () => false
  }
]

/**
 * Takes a set of parsed code properties and returns an object of their actual values.
 *
 * @param config - An object where each value is a piece of parsed code.
 * @returns An object with the same keys mapped to their plain string, number, or boolean values.
 */
export default function resolveExpressionMap(
  config: Record<string, ts.Expression>
) {
  const parsed: Record<string, string | number | boolean> = {}

  for (const [name, initializer] of Object.entries(config)) {
    const rule = expressionRules.find(r => r.test(initializer))

    if (rule) {
      parsed[name] = rule.parse(initializer)
    }
  }

  return parsed
}
