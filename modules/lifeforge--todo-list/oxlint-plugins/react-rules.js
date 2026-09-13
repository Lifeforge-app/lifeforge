function walk(node, callback, root = node, seen = new Set()) {
  if (!node || typeof node !== 'object' || seen.has(node)) return
  if (node !== root && node.type === 'JSXExpressionContainer') return

  if (
    node !== root &&
    [
      'ArrowFunctionExpression',
      'FunctionExpression',
      'FunctionDeclaration'
    ].includes(node.type)
  ) {
    return
  }

  seen.add(node)
  callback(node)

  for (const [key, value] of Object.entries(node)) {
    if (
      key === 'parent' ||
      key === 'loc' ||
      key === 'range' ||
      key === 'tokens'
    ) {
      continue
    }

    if (Array.isArray(value)) {
      for (const child of value) walk(child, callback, root, seen)
    } else {
      walk(value, callback, root, seen)
    }
  }
}

function isBooleanLogical(node) {
  return (
    node?.type === 'LogicalExpression' &&
    (node.operator === '&&' || node.operator === '||')
  )
}

function hasBooleanLogical(node) {
  let found = false
  walk(node, child => {
    if (isBooleanLogical(child)) found = true
  })

  return found
}

function isPublicApiJSDoc(comment, sourceCode) {
  return (
    comment.type === 'Block' &&
    comment.value.startsWith('*') &&
    sourceCode?.getTokenAfter(comment)?.value === 'export'
  )
}

export const rules = {
  'no-arrow-component': {
    meta: { type: 'suggestion' },
    create(context) {
      return {
        VariableDeclarator(node) {
          if (
            node.id?.name?.[0] === node.id.name?.[0]?.toUpperCase() &&
            (node.init?.type === 'ArrowFunctionExpression' ||
              node.init?.type === 'FunctionExpression')
          ) {
            context.report({
              node,
              message: 'Components must use a function declaration.'
            })
          }
        }
      }
    }
  },
  'no-compound-jsx-condition': {
    meta: { type: 'problem' },
    create(context) {
      return {
        JSXExpressionContainer(node) {
          let conditionalCount = 0
          let logicalCount = 0

          const conditionalExpressions = []

          walk(node.expression, child => {
            if (child.type === 'ConditionalExpression') {
              conditionalCount++
              conditionalExpressions.push(child)
            }

            if (isBooleanLogical(child)) {
              logicalCount++
            }
          })

          const nestedOrMultipleTernaries = conditionalCount > 1
          const compoundTernaryCondition = conditionalExpressions.some(
            conditional => hasBooleanLogical(conditional.test)
          )

          if (
            nestedOrMultipleTernaries ||
            compoundTernaryCondition ||
            (node.expression.type === 'ConditionalExpression' &&
              logicalCount > 0) ||
            (node.expression.type === 'LogicalExpression' &&
              node.expression.operator === '||') ||
            logicalCount >= 2
          ) {
            context.report({
              node,
              message: 'Derive compound JSX conditions before return.'
            })
          }
        }
      }
    }
  },
  'no-trailing-export-block': {
    meta: { type: 'suggestion' },
    create(context) {
      return {
        ExportNamedDeclaration(node) {
          if (!node.source && !node.declaration && node.specifiers?.length) {
            context.report({
              node,
              message: 'Export declarations at their declaration site.'
            })
          }
        }
      }
    }
  },
  'no-comments': {
    meta: { type: 'suggestion' },
    create(context) {
      return {
        Program() {
          const sourceCode = context.sourceCode ?? context.getSourceCode?.()
          const comments = sourceCode?.getAllComments?.() ?? []

          for (const comment of comments) {
            const isTypeScriptDirective =
              comment.type === 'Line' && /\/?\s*<reference/.test(comment.value)

            if (
              !isTypeScriptDirective &&
              !isPublicApiJSDoc(comment, sourceCode)
            ) {
              context.report({
                node: comment,
                message: 'Comments are not allowed except JSDoc on public APIs.'
              })
            }
          }
        }
      }
    }
  }
}

export default { meta: { name: 'react-rules' }, rules }
