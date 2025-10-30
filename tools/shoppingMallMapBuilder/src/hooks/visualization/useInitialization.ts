import * as d3 from 'd3'
import { useEffect } from 'react'

import { useFloors } from '../../providers/FloorsProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'
import { useSettings } from '../../providers/SettingsProvider'

export default function useInitialSetup({
  setImageLoaded
}: {
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { svgRef, gRef } = useSVGRefContext()

  const { showFloorPlanImage } = useSettings()

  const {
    selectedFloor: { floorPlanImage: mapImage }
  } = useFloors()

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    const svg = d3.select(svgRef.current)

    const g = d3.select(gRef.current)

    // Clear all existing layers first
    g.selectAll('*').remove()

    // Create layers first (order matters - last one is on top)
    const imageLayer = g.append('g').attr('class', 'image-layer')

    g.append('g').attr('class', 'polygon-layer')

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', event => {
        g.attr('transform', event.transform.toString())
      })

    // Apply zoom behavior to SVG
    svg.call(zoom)

    if (!mapImage) {
      // Set initial zoom to center the view
      const rect = svgRef.current.getBoundingClientRect()

      const initialTransform = d3.zoomIdentity
        .translate(rect.width / 2, rect.height / 2)
        .scale(0.5)
        .translate(-rect.width / 2, -rect.height / 2)

      svg.call(zoom.transform, initialTransform)

      setImageLoaded(true)

      return
    }

    // Load and add the image once
    const img = new Image()

    img.onload = () => {
      const imgWidth = img.width

      const imgHeight = img.height

      // Center the image in the viewport
      const rect = svgRef.current!.getBoundingClientRect()

      const initialTransform = d3.zoomIdentity
        .translate(rect.width / 2, rect.height / 2)
        .scale(0.5)
        .translate(-imgWidth / 2, -imgHeight / 2)

      svg.call(zoom.transform, initialTransform)

      if (!showFloorPlanImage) {
        setImageLoaded(true)

        return
      }

      imageLayer
        .append('image')
        .attr('href', mapImage)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', imgWidth)
        .attr('height', imgHeight)

      // Set initial zoom to center the image

      setImageLoaded(true)
    }
    img.src = mapImage
  }, [mapImage, showFloorPlanImage])
}
