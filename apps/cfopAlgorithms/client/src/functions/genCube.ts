interface Cube {
  top: string[][]
  bottom: string[][]
  front: string[][]
  back: string[][]
  left: string[][]
  right: string[][]
}

function rotateFace(face: string[][]): string[][] {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]]
  ]
}

function rotateFaceCounter(face: string[][]): string[][] {
  return [
    [face[0][2], face[1][2], face[2][2]],
    [face[0][1], face[1][1], face[2][1]],
    [face[0][0], face[1][0], face[2][0]]
  ]
}

function copyCube(cube: Cube): Cube {
  return JSON.parse(JSON.stringify(cube))
}

function applyMove(cube: Cube, move: string): Cube {
  const newCube = copyCube(cube)

  const { top, bottom, front, back, left, right } = cube

  if (move === 'U') {
    newCube.top = rotateFace(top)

    for (let i = 0; i < 3; i++) {
      newCube.front[0][i] = right[0][i]
      newCube.right[0][i] = back[0][i]
      newCube.back[0][i] = left[0][i]
      newCube.left[0][i] = front[0][i]
    }
  } else if (move === "U'") {
    newCube.top = rotateFaceCounter(top)

    for (let i = 0; i < 3; i++) {
      newCube.front[0][i] = left[0][i]
      newCube.right[0][i] = front[0][i]
      newCube.back[0][i] = right[0][i]
      newCube.left[0][i] = back[0][i]
    }
  } else if (move === 'D') {
    newCube.bottom = rotateFace(bottom)

    for (let i = 0; i < 3; i++) {
      newCube.front[2][i] = left[2][i]
      newCube.right[2][i] = front[2][i]
      newCube.back[2][i] = right[2][i]
      newCube.left[2][i] = back[2][i]
    }
  } else if (move === "D'") {
    newCube.bottom = rotateFaceCounter(bottom)

    for (let i = 0; i < 3; i++) {
      newCube.front[2][i] = right[2][i]
      newCube.right[2][i] = back[2][i]
      newCube.back[2][i] = left[2][i]
      newCube.left[2][i] = front[2][i]
    }
  } else if (move === 'F') {
    newCube.front = rotateFace(front)

    for (let i = 0; i < 3; i++) {
      newCube.top[2][i] = left[2 - i][2]
      newCube.right[i][0] = top[2][i]
      newCube.bottom[0][2 - i] = right[i][0]
      newCube.left[i][2] = bottom[0][i]
    }
  } else if (move === "F'") {
    newCube.front = rotateFaceCounter(front)

    for (let i = 0; i < 3; i++) {
      newCube.top[2][i] = right[i][0]
      newCube.right[i][0] = bottom[0][2 - i]
      newCube.bottom[0][2 - i] = left[2 - i][2]
      newCube.left[i][2] = top[2][2 - i]
    }
  } else if (move === 'B') {
    newCube.back = rotateFace(back)

    for (let i = 0; i < 3; i++) {
      newCube.top[0][i] = right[i][2]
      newCube.right[i][2] = bottom[2][2 - i]
      newCube.bottom[2][2 - i] = left[2 - i][0]
      newCube.left[i][0] = top[0][2 - i]
    }
  } else if (move === "B'") {
    newCube.back = rotateFaceCounter(back)

    for (let i = 0; i < 3; i++) {
      newCube.top[0][i] = left[i][0]
      newCube.right[i][2] = top[0][i]
      newCube.bottom[2][2 - i] = right[i][2]
      newCube.left[2 - i][0] = bottom[2][2 - i]
    }
  } else if (move === 'L') {
    newCube.left = rotateFace(left)

    for (let i = 0; i < 3; i++) {
      newCube.top[i][0] = back[2 - i][2]
      newCube.front[i][0] = top[i][0]
      newCube.bottom[i][0] = front[i][0]
      newCube.back[2 - i][2] = bottom[i][0]
    }
  } else if (move === "L'") {
    newCube.left = rotateFaceCounter(left)

    for (let i = 0; i < 3; i++) {
      newCube.top[i][0] = front[i][0]
      newCube.front[i][0] = bottom[i][0]
      newCube.bottom[i][0] = back[2 - i][2]
      newCube.back[2 - i][2] = top[i][0]
    }
  } else if (move === 'R') {
    newCube.right = rotateFace(right)

    for (let i = 0; i < 3; i++) {
      newCube.top[i][2] = front[i][2]
      newCube.front[i][2] = bottom[i][2]
      newCube.bottom[i][2] = back[2 - i][0]
      newCube.back[2 - i][0] = top[i][2]
    }
  } else if (move === "R'") {
    newCube.right = rotateFaceCounter(right)

    for (let i = 0; i < 3; i++) {
      newCube.top[i][2] = back[2 - i][0]
      newCube.front[i][2] = top[i][2]
      newCube.bottom[i][2] = front[i][2]
      newCube.back[2 - i][0] = bottom[i][2]
    }
  } else if (move === 'M') {
    for (let i = 0; i < 3; i++) {
      newCube.top[i][1] = back[2 - i][1]
      newCube.front[i][1] = top[i][1]
      newCube.bottom[i][1] = front[i][1]
      newCube.back[2 - i][1] = bottom[i][1]
    }
  } else if (move === "M'") {
    for (let i = 0; i < 3; i++) {
      newCube.top[i][1] = front[i][1]
      newCube.front[i][1] = bottom[i][1]
      newCube.bottom[i][1] = back[2 - i][1]
      newCube.back[2 - i][1] = top[i][1]
    }
  } else if (move === 'E') {
    for (let i = 0; i < 3; i++) {
      newCube.front[1][i] = right[1][i]
      newCube.right[1][i] = back[1][i]
      newCube.back[1][i] = left[1][i]
      newCube.left[1][i] = front[1][i]
    }
  } else if (move === "E'") {
    for (let i = 0; i < 3; i++) {
      newCube.front[1][i] = left[1][i]
      newCube.right[1][i] = front[1][i]
      newCube.back[1][i] = right[1][i]
      newCube.left[1][i] = back[1][i]
    }
  } else if (move === 'S') {
    for (let i = 0; i < 3; i++) {
      newCube.top[1][i] = left[2 - i][1]
      newCube.left[i][1] = bottom[1][2 - i]
      newCube.bottom[1][i] = right[i][1]
      newCube.right[i][1] = top[1][i]
    }
  } else if (move === "S'") {
    for (let i = 0; i < 3; i++) {
      newCube.top[1][i] = right[i][1]
      newCube.left[i][1] = top[1][i]
      newCube.bottom[1][i] = left[2 - i][1]
      newCube.right[i][1] = bottom[1][2 - i]
    }
  } else if (move === 'x') {
    newCube.right = rotateFace(right)
    newCube.left = rotateFaceCounter(left)

    const [front, bottom, back, top] = [
      [...cube.front],
      [...cube.bottom],
      [...cube.back],
      [...cube.top]
    ]

    newCube.top = front
    newCube.front = bottom
    newCube.bottom = rotateFace(rotateFace(back))
    newCube.back = rotateFace(rotateFace(top))
  } else if (move === "x'") {
    newCube.right = rotateFaceCounter(right)
    newCube.left = rotateFace(left)

    const [front, bottom, back, top] = [
      [...cube.front],
      [...cube.bottom],
      [...cube.back],
      [...cube.top]
    ]

    newCube.top = rotateFace(rotateFace(back))
    newCube.front = top
    newCube.bottom = front
    newCube.back = rotateFace(rotateFace(bottom))
  } else if (move === 'y') {
    newCube.top = rotateFace(top)
    newCube.bottom = rotateFaceCounter(bottom)

    const [front, back, left, right] = [
      [...cube.front],
      [...cube.back],
      [...cube.left],
      [...cube.right]
    ]

    newCube.front = right
    newCube.right = back
    newCube.back = left
    newCube.left = front
  } else if (move === "y'") {
    newCube.top = rotateFaceCounter(top)
    newCube.bottom = rotateFace(bottom)

    const [front, back, left, right] = [
      [...cube.front],
      [...cube.back],
      [...cube.left],
      [...cube.right]
    ]

    newCube.front = left
    newCube.right = front
    newCube.back = right
    newCube.left = back
  } else if (move === 'z') {
    newCube.front = rotateFace(front)
    newCube.back = rotateFaceCounter(back)

    const [top, bottom, left, right] = [
      [...cube.top],
      [...cube.bottom],
      [...cube.left],
      [...cube.right]
    ]

    newCube.top = rotateFace(left)
    newCube.left = rotateFace(bottom)
    newCube.bottom = rotateFace(right)
    newCube.right = rotateFace(top)
  } else if (move === "z'") {
    newCube.front = rotateFaceCounter(front)
    newCube.back = rotateFace(back)

    const [top, bottom, left, right] = [
      [...cube.top],
      [...cube.bottom],
      [...cube.left],
      [...cube.right]
    ]

    newCube.top = rotateFaceCounter(right)
    newCube.left = rotateFaceCounter(top)
    newCube.bottom = rotateFaceCounter(left)
    newCube.right = rotateFaceCounter(bottom)
  }

  return newCube
}

function performMiddleMove(cube: Cube, move: string): Cube {
  let newCube = copyCube(cube)

  if (move === 'r') {
    newCube = applyMove(newCube, "M'")
  } else if (move === "r'") {
    newCube = applyMove(newCube, 'M')
  } else if (move === 'l') {
    newCube = applyMove(newCube, 'M')
  } else if (move === "l'") {
    newCube = applyMove(newCube, "M'")
  } else if (move === 'u') {
    newCube = applyMove(newCube, 'E')
  } else if (move === "u'") {
    newCube = applyMove(newCube, "E'")
  } else if (move === 'd') {
    newCube = applyMove(newCube, "E'")
  } else if (move === "d'") {
    newCube = applyMove(newCube, 'E')
  } else if (move === 'f') {
    newCube = applyMove(newCube, 'S')
  } else if (move === "f'") {
    newCube = applyMove(newCube, "S'")
  } else if (move === 'b') {
    newCube = applyMove(newCube, "S'")
  } else if (move === "b'") {
    newCube = applyMove(newCube, 'S')
  }

  return newCube
}

function applyMoves(cube: Cube, moves: string): Cube {
  const movesArray = moves.split(' ')

  let resultCube = copyCube(cube)

  for (const move of movesArray) {
    let needTwoTimes = false
    if (move.endsWith('2')) needTwoTimes = true

    resultCube = applyMove(resultCube, move.toUpperCase().replace('2', ''))

    if (move === move.toLowerCase()) {
      resultCube = performMiddleMove(resultCube, move)
    }

    if (needTwoTimes) {
      resultCube = applyMove(resultCube, move.toUpperCase().replace('2', ''))

      if (move === move.toLowerCase()) {
        resultCube = performMiddleMove(resultCube, move)
      }
    }
  }

  return resultCube
}

export const DEFAULT_CUBE = {
  top: [
    ['Y', 'Y', 'Y'],
    ['Y', 'Y', 'Y'],
    ['Y', 'Y', 'Y']
  ],
  bottom: [
    ['W', 'W', 'W'],
    ['W', 'W', 'W'],
    ['W', 'W', 'W']
  ],
  front: [
    ['R', 'R', 'R'],
    ['R', 'R', 'R'],
    ['R', 'R', 'R']
  ],
  back: [
    ['O', 'O', 'O'],
    ['O', 'O', 'O'],
    ['O', 'O', 'O']
  ],
  left: [
    ['B', 'B', 'B'],
    ['B', 'B', 'B'],
    ['B', 'B', 'B']
  ],
  right: [
    ['G', 'G', 'G'],
    ['G', 'G', 'G'],
    ['G', 'G', 'G']
  ]
}

export { applyMoves }
