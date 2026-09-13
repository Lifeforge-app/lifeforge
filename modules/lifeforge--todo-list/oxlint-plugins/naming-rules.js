export const rules = {
  'kebab-case-filenames': {
    meta: { type: 'suggestion' },
    create(context) {
      return {
        Program(node) {
          const filename = context.filename.split('/').pop() ?? ''

          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+)*$/.test(filename)) {
            context.report({
              node,
              message: 'Source filenames must use kebab-case.'
            })
          }
        }
      }
    }
  },
  'no-i-prefix-types': {
    meta: { type: 'suggestion' },
    create(context) {
      function checkTypeName(node) {
        if (/^I[A-Z]/.test(node.id?.name ?? '')) {
          context.report({
            node,
            message: 'Type names must not use an I prefix.'
          })
        }
      }

      return {
        TSInterfaceDeclaration: checkTypeName,
        TSTypeAliasDeclaration: checkTypeName
      }
    }
  }
}

export default { meta: { name: 'naming-rules' }, rules }
