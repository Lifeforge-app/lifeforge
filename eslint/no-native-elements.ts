import type { TSESTree } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'

/** SVG elements have no primitive equivalent and are not native widgets. */
const SVG_ELEMENTS = new Set([
  'circle',
  'clipPath',
  'defs',
  'ellipse',
  'g',
  'line',
  'linearGradient',
  'mask',
  'path',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'text',
  'tspan',
  'use'
])

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow native HTML elements in application and module UI.'
    },
    schema: [],
    messages: {
      noNativeElement:
        'Native <{{name}}> is not allowed. Use a UI primitive from @lifeforge/ui instead.'
    }
  },
  create(context) {
    return {
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        if (node.name.type !== 'JSXIdentifier') return

        const name = node.name.name

        if (!/^[a-z]/.test(name) || SVG_ELEMENTS.has(name)) return

        context.report({
          node,
          messageId: 'noNativeElement',
          data: { name }
        })
      }
    }
  }
}

export default rule
