const roundedPolygon = (points: { x: number; y: number }[], radius: number) => {
  const qb = []

  for (let index = 0; index < points.length; index++) {
    const first = points[index]

    const second = points[(index + 1) % points.length]

    const distance = Math.hypot(first.x - second.x, first.y - second.y)

    const ratio = radius / distance

    const dx = (second.x - first.x) * ratio

    const dy = (second.y - first.y) * ratio

    qb.push({ x: first.x + dx, y: first.y + dy })
    qb.push({ x: second.x - dx, y: second.y - dy })
  }

  let path = `M ${qb[0].x}, ${qb[0].y} L ${qb[1].x}, ${qb[1].y}`

  for (let index = 1; index < points.length; index++) {
    path += ` Q ${points[index].x},${points[index].y} ${qb[index * 2].x}, ${
      qb[index * 2].y
    }`
    path += ` L ${qb[index * 2 + 1].x}, ${qb[index * 2 + 1].y}`
  }
  path += ` Q ${points[0].x},${points[0].y} ${qb[0].x}, ${qb[0].y} Z`

  return path
}

export default roundedPolygon
