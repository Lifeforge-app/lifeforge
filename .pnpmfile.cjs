function readPackage(pkg, context) {
  const name = pkg.name ?? ''

  if (
    !name.startsWith('@lifeforge/') &&
    !name.startsWith('lifeforge-') &&
    name !== 'lifeforge-monorepo'
  ) {
    if (pkg.peerDependencies && pkg.peerDependencies.typescript) {
      delete pkg.peerDependencies.typescript
      pkg.dependencies = pkg.dependencies || {}
      pkg.dependencies.typescript = 'npm:@typescript/typescript6@^6.0.2'
    } else if (pkg.dependencies && pkg.dependencies.typescript) {
      pkg.dependencies.typescript = 'npm:@typescript/typescript6@^6.0.2'
    }
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
