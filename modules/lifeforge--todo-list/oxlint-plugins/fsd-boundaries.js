const layerOrder = ['shared', 'entities', 'features', 'pages', 'app']

function getLayer(source) {
  return layerOrder.find(layer => source.startsWith(`@/${layer}/`))
}

export const rules = {
  'fsd-import-boundary': {
    meta: { type: 'problem' },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value

          if (typeof source !== 'string' || !source.startsWith('@/')) return

          const current = layerOrder.find(layer =>
            context.filename.includes(`/src/${layer}/`)
          )
          const imported = getLayer(source)

          if (!current || !imported) return

          const currentIndex = layerOrder.indexOf(current)
          const importedIndex = layerOrder.indexOf(imported)

          if (importedIndex > currentIndex) {
            context.report({
              node,
              message: `Invalid FSD import: ${current} cannot import ${imported}.`
            })
          }
        }
      }
    }
  },
  'fsd-public-api': {
    meta: { type: 'problem' },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value

          if (typeof source !== 'string' || !source.startsWith('@/')) return

          const slicePath = source.match(
            /^@\/(app|pages|features|entities|shared)\/([^/]+)\//
          )

          if (slicePath) {
            context.report({
              node,
              message: `Import slice ${slicePath[2]} through its public API.`
            })
          }
        }
      }
    }
  }
}

export default { meta: { name: 'fsd-boundaries' }, rules }
