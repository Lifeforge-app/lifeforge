export default function loadCategoryOrder() {
  const categoryFile = import.meta.glob('../../apps/cat.config.json', {
    eager: true
  })

  let categoriesSeq: string[] = []

  if (categoryFile['../../apps/cat.config.json']) {
    categoriesSeq = (
      categoryFile['../../apps/cat.config.json'] as { default: string[] }
    ).default
  }

  return categoriesSeq
}
