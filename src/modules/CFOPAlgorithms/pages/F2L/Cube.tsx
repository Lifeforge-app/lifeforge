import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

function Cube(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current === null) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0xffffff, 0)
    renderer.setSize(128, 128)
    renderer.setPixelRatio(window.devicePixelRatio) // This line increases the resolution
    ref.current.appendChild(renderer.domElement)

    const cubeSize = 0.7
    const edgeThickness = 0.04
    const borderColor = 0x000000

    const rubiksCube = new THREE.Group()

    const red = 0xff0000
    const orange = 0xffa500
    const yellow = 0xffff00
    const green = 0x00ff00
    const blue = 0x0000ff
    const white = 0xffffff
    const gray = 0x404040

    function createMaterials(x, y, z) {
      const materials = [
        new THREE.MeshBasicMaterial({ color: gray }), // right
        new THREE.MeshBasicMaterial({ color: gray }), // left
        new THREE.MeshBasicMaterial({ color: gray }), // top
        new THREE.MeshBasicMaterial({ color: gray }), // bottom
        new THREE.MeshBasicMaterial({ color: gray }), // back
        new THREE.MeshBasicMaterial({ color: gray }) // front
      ]
      // Example: color the top face of the cube at (1, 2, 0) with yellow
      if (x === 0 && y === 2 && z === 2) {
        materials[2] = new THREE.MeshBasicMaterial({ color: white })
      }
      if (x === 0 && y === 2 && z === 1) {
        materials[2] = new THREE.MeshBasicMaterial({ color: red })
      }
      if (x === 1 && y === 0 && z === 2) {
        materials[4] = new THREE.MeshBasicMaterial({ color: green })
      }
      if (x === 2 && y === 1 && z === 2) {
        materials[4] = new THREE.MeshBasicMaterial({ color: green })
      }
      if (x === 1 && y === 1 && z === 2) {
        materials[4] = new THREE.MeshBasicMaterial({ color: green })
      }
      if (x === 2 && y === 0 && z === 2) {
        materials[4] = new THREE.MeshBasicMaterial({ color: green })
      }
      if (x === 0 && y === 2 && z === 2) {
        materials[4] = new THREE.MeshBasicMaterial({ color: red })
      }
      if (x === 0 && y === 0 && z === 0) {
        materials[1] = new THREE.MeshBasicMaterial({ color: red })
      }
      if (x === 0 && y === 0 && z === 1) {
        materials[1] = new THREE.MeshBasicMaterial({ color: red })
      }
      if (x === 0 && y === 1 && z === 0) {
        materials[1] = new THREE.MeshBasicMaterial({ color: red })
      }
      if (x === 0 && y === 1 && z === 1) {
        materials[1] = new THREE.MeshBasicMaterial({ color: red })
      }
      if (x === 0 && y === 2 && z === 1) {
        materials[1] = new THREE.MeshBasicMaterial({ color: green })
      }
      if (x === 0 && y === 2 && z === 2) {
        materials[1] = new THREE.MeshBasicMaterial({ color: green })
      }

      return materials
    }

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
          const materials = createMaterials(x, y, z)
          const cube = new THREE.Mesh(geometry, materials)

          // Create a slightly larger box for the border
          const borderGeometry = new THREE.BoxGeometry(
            cubeSize + edgeThickness * 2,
            cubeSize + edgeThickness * 2,
            cubeSize + edgeThickness * 2
          )
          const borderMaterial = new THREE.MeshBasicMaterial({
            color: borderColor,
            side: THREE.BackSide
          })
          const border = new THREE.Mesh(borderGeometry, borderMaterial)

          // Create edges for the cube
          const edgeMaterial = new THREE.MeshBasicMaterial({
            color: borderColor
          })

          // Position the cube and border in the 3x3x3 grid
          cube.position.set(
            (x - 1) * (cubeSize + edgeThickness * 2),
            (y - 1) * (cubeSize + edgeThickness * 2),
            (z - 1) * (cubeSize + edgeThickness * 2)
          )
          border.position.copy(cube.position)

          rubiksCube.add(cube)
          rubiksCube.add(border) // Add the border to the scene

          if (x == 0 && z == 2) {
            const edgeGeometry = new THREE.BoxGeometry(
              edgeThickness,
              cubeSize + edgeThickness,
              edgeThickness
            )

            const edge = new THREE.Mesh(edgeGeometry, edgeMaterial)
            edge.position.set(-cubeSize / 2, 0, cubeSize / 2)
            edge.position.add(cube.position)
            rubiksCube.add(edge) // Add the edges to the scene
          }

          if (y == 2 && z == 2) {
            const edgeGeometry = new THREE.BoxGeometry(
              cubeSize + edgeThickness,
              edgeThickness,
              edgeThickness
            )

            const edge = new THREE.Mesh(edgeGeometry, edgeMaterial)
            edge.position.set(0, cubeSize / 2, cubeSize / 2)
            edge.position.add(cube.position)
            rubiksCube.add(edge) // Add the edges to the scene
          }
          if (y == 2 && x == 0) {
            const edgeGeometry = new THREE.BoxGeometry(
              edgeThickness,
              edgeThickness,
              cubeSize + edgeThickness
            )

            const edge = new THREE.Mesh(edgeGeometry, edgeMaterial)
            edge.position.set(-cubeSize / 2, cubeSize / 2, 0)
            edge.position.add(cube.position)
            rubiksCube.add(edge) // Add the edges to the scene
          }
        }
      }
    }

    rubiksCube.rotation.x = Math.PI / 6
    rubiksCube.rotation.y = Math.PI / 4

    scene.add(rubiksCube)

    camera.position.z = 5

    renderer.render(scene, camera)

    return () => {
      scene.remove(rubiksCube)
      renderer.dispose()

      ref.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} />
}

export default Cube
