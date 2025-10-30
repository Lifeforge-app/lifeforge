import * as d3 from 'd3'
import { useCallback, useEffect, useMemo } from 'react'

import { useAmenities } from '../../providers/AmenitiesProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'
import { useSettings } from '../../providers/SettingsProvider'
import type { CoordinateWithSnapInfo, HighlightedCoord } from '../../types'
import { calculateCenter } from '../../utils/unitUtils'

type Point = [number, number]
type D3Selection = d3.Selection<SVGGElement, unknown, null, undefined>

const COLORS = {
  selected: '#3b82f6',
  default: '#374151',
  defaultUnit: '#9ca3af',
  temporary: '#ef4444',
  clickable: '#10b981',
  white: '#ffffff',
  textDark: '#1f2937',
  textLight: '#fff'
} as const

const STYLES = {
  selectedFill: 'rgba(59, 130, 246, 0.3)',
  defaultUnitFill: 'rgba(156, 163, 175, 0.2)',
  temporaryFill: 'rgba(239, 68, 68, 0.2)',
  dashedLine: '5,5'
} as const

interface RenderCanvasContentProps {
  imageLoaded: boolean
  highlightedCoord: HighlightedCoord | null
  newCoordinates: CoordinateWithSnapInfo[]
}

export default function useRenderCanvasContent({
  imageLoaded,
  highlightedCoord,
  newCoordinates
}: RenderCanvasContentProps) {
  const { gRef } = useSVGRefContext()

  const {
    selectedElementId,
    setSelectedElementId,
    drawingMode,
    isDrawing,
    addPoint
  } = useDrawing()

  const { showFloorPlanImage, unitLabelFontSize, pointRadius } = useSettings()

  const { amenityTypes } = useAmenities()

  const {
    selectedFloor: {
      floorPlanImage: mapImage,
      units,
      buildingOutlines,
      buildingOutlineCircles,
      amenities
    }
  } = useFloors()

  const handlePointClick = useCallback(
    (point: Point) => {
      addPoint(point, true)
    },
    [addPoint]
  )

  // Memoize sorted units
  const sortedUnits = useMemo(() => {
    const filtered =
      isDrawing && selectedElementId && drawingMode === 'units'
        ? units.filter(u => u.id === selectedElementId)
        : units

    return !isDrawing && selectedElementId && drawingMode === 'units'
      ? [
          ...filtered.filter(u => u.id !== selectedElementId),
          ...filtered.filter(u => u.id === selectedElementId)
        ]
      : filtered
  }, [isDrawing, selectedElementId, drawingMode, units])

  // Extract rendering functions
  const renderPoint = useCallback(
    (
      layer: D3Selection,
      point: Point,
      color: string,
      className?: string,
      onClick?: (event: PointerEvent) => void
    ) => {
      const circle = layer
        .append('circle')
        .attr('cx', point[0])
        .attr('cy', point[1])
        .attr('r', pointRadius)
        .attr('fill', color)
        .attr('stroke', COLORS.white)
        .attr('stroke-width', Math.max(2, pointRadius * 0.25))

      if (className) {
        circle.attr('class', className)
      }

      if (onClick) {
        circle.style('cursor', 'pointer').on('click', (event: PointerEvent) => {
          event.stopPropagation()
          onClick(event)
        })
      }
    },
    [pointRadius]
  )

  const renderLine = useCallback(
    (
      layer: D3Selection,
      start: Point,
      end: Point,
      stroke: string,
      strokeWidth: number,
      dashed: boolean = false
    ) => {
      const lineElement = layer
        .append('line')
        .attr('x1', start[0])
        .attr('y1', start[1])
        .attr('x2', end[0])
        .attr('y2', end[1])
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)

      if (dashed) {
        lineElement.attr('stroke-dasharray', STYLES.dashedLine)
      }
    },
    []
  )

  const renderOutlines = useCallback(
    (layer: D3Selection) => {
      buildingOutlines.forEach(outline => {
        if (outline.segments.length < 2) return

        const isSelected = outline.id === selectedElementId

        const shouldRender =
          !isDrawing || (isDrawing && drawingMode === 'outline')

        if (
          !shouldRender ||
          (isDrawing && drawingMode === 'outline' && isSelected)
        )
          return

        // Draw line segments
        for (let i = 0; i < outline.segments.length - 1; i++) {
          layer
            .append('line')
            .attr('x1', outline.segments[i][0])
            .attr('y1', outline.segments[i][1])
            .attr('x2', outline.segments[i + 1][0])
            .attr('y2', outline.segments[i + 1][1])
            .attr(
              'stroke',
              isSelected ? COLORS.selected : outline.color || COLORS.default
            )
            .attr('stroke-width', isSelected ? 3 : outline.strokeWidth || 2)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .style('cursor', 'pointer')
            .on('click', (event: PointerEvent) => {
              event.stopPropagation()

              if (!isDrawing && drawingMode === 'outline') {
                setSelectedElementId(outline.id)
              }
            })
        }

        // Draw points for selected outline when not in drawing mode
        if (isSelected && !isDrawing) {
          outline.segments.forEach(segment => {
            renderPoint(layer, segment, COLORS.selected)
          })
        }
      })
    },
    [
      buildingOutlines,
      selectedElementId,
      isDrawing,
      drawingMode,
      setSelectedElementId,
      renderPoint
    ]
  )

  const renderOutlineCircles = useCallback(
    (layer: D3Selection) => {
      buildingOutlineCircles.forEach(circle => {
        const isSelected = circle.id === selectedElementId

        const shouldRender =
          !isDrawing || (isDrawing && drawingMode === 'outline-circle')

        if (
          !shouldRender ||
          (isDrawing && drawingMode === 'outline-circle' && isSelected)
        )
          return

        // Draw the circle
        layer
          .append('circle')
          .attr('cx', circle.center[0])
          .attr('cy', circle.center[1])
          .attr('r', circle.radius)
          .attr('fill', 'none')
          .attr(
            'stroke',
            isSelected ? COLORS.selected : circle.color || COLORS.default
          )
          .attr('stroke-width', isSelected ? 3 : circle.strokeWidth || 2)
          .style('cursor', 'pointer')
          .attr('class', 'outline-circle')
          .on('click', (event: PointerEvent) => {
            event.stopPropagation()

            if (!isDrawing && drawingMode === 'outline-circle') {
              setSelectedElementId(circle.id)
            }
          })

        // Draw center point and radius indicator for selected circle when not in drawing mode
        if (isSelected && !isDrawing) {
          renderPoint(layer, circle.center, COLORS.selected)
          renderLine(
            layer,
            circle.center,
            [circle.center[0] + circle.radius, circle.center[1]],
            COLORS.selected,
            2,
            true
          )
        }
      })
    },
    [
      buildingOutlineCircles,
      selectedElementId,
      isDrawing,
      drawingMode,
      setSelectedElementId,
      renderPoint,
      renderLine
    ]
  )

  const renderAmenities = useCallback(
    (layer: D3Selection) => {
      amenities.forEach(amenity => {
        const amenityType = amenityTypes.find(
          t => t.id === amenity.amenityTypeId
        )

        if (!amenityType) return

        const isSelected = amenity.id === selectedElementId

        const shouldRender =
          !isDrawing || (isDrawing && drawingMode === 'amenity' && !isSelected)

        if (!shouldRender) return

        const iconSize = 32

        const iconColor = isSelected
          ? COLORS.selected
          : showFloorPlanImage && mapImage
            ? COLORS.default
            : COLORS.white

        // Parse icon name (format: "prefix:name" or "prefix/name")
        const iconParts = amenityType.icon.replace(':', '/').split('/')

        const iconPrefix = iconParts[0]

        const iconName = iconParts[1]

        // Generate Iconify API URL
        const colorHex = iconColor.replace('#', '%23')

        const iconUrl = `https://api.iconify.design/${iconPrefix}/${iconName}.svg?height=${iconSize}&color=${colorHex}`

        // Create a group for the amenity
        const amenityGroup = layer
          .append('g')
          .attr(
            'transform',
            `translate(${amenity.coordinate[0] - iconSize / 2}, ${amenity.coordinate[1] - iconSize / 2})`
          )
          .style('cursor', 'pointer')
          .on('click', (event: PointerEvent) => {
            event.stopPropagation()

            if (!isDrawing && drawingMode === 'amenity') {
              setSelectedElementId(amenity.id)
            }
          })

        // Add background circle for better visibility
        amenityGroup
          .append('circle')
          .attr('cx', iconSize / 2)
          .attr('cy', iconSize / 2)
          .attr('r', iconSize / 2 + 4)
          .attr(
            'fill',
            mapImage && showFloorPlanImage ? COLORS.white : COLORS.default
          )
          .attr('stroke', iconColor)
          .attr('stroke-width', isSelected ? 3 : 2)

        // Add icon using SVG image from Iconify API
        amenityGroup
          .append('image')
          .attr('href', iconUrl)
          .attr('width', iconSize)
          .attr('height', iconSize)
          .attr('pointer-events', 'none')

        // Draw point when selected and not drawing
        if (isSelected && !isDrawing) {
          renderPoint(layer, amenity.coordinate, COLORS.selected)
        }
      })
    },
    [
      amenities,
      amenityTypes,
      selectedElementId,
      isDrawing,
      drawingMode,
      showFloorPlanImage,
      mapImage,
      setSelectedElementId,
      renderPoint
    ]
  )

  const renderUnits = useCallback(
    (layer: D3Selection, clickable: boolean) => {
      sortedUnits.forEach(unit => {
        if (unit.coordinates.length < 3) return

        const isSelected = unit.id === selectedElementId

        if (isDrawing && isSelected) return

        layer
          .append('polygon')
          .attr('points', unit.coordinates.map(d => d.join(',')).join(' '))
          .attr(
            'fill',
            isSelected ? STYLES.selectedFill : STYLES.defaultUnitFill
          )
          .attr('stroke', isSelected ? COLORS.selected : COLORS.defaultUnit)
          .attr('stroke-width', isSelected ? 3 : 2)
          .style('cursor', clickable ? 'pointer' : (null as unknown as string))
          .on(
            'click',
            clickable
              ? (event: PointerEvent) => {
                  event.stopPropagation()

                  if (!isDrawing && drawingMode === 'units') {
                    setSelectedElementId(unit.id)
                  }
                }
              : () => {}
          )

        // Add label
        if (unit.coordinates.length > 0) {
          const [centerX, centerY] = calculateCenter(unit.coordinates)

          const offsetX = unit.labelOffsetX || 0

          const offsetY = unit.labelOffsetY || 0

          layer
            .append('text')
            .attr('x', centerX + offsetX)
            .attr('y', centerY + offsetY)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr(
              'fill',
              showFloorPlanImage && mapImage
                ? COLORS.textDark
                : COLORS.textLight
            )
            .attr('font-size', `${unitLabelFontSize}px`)
            .attr('font-weight', 'bold')
            .attr('pointer-events', 'none')
            .text(unit.name)
        }
      })
    },
    [
      sortedUnits,
      selectedElementId,
      isDrawing,
      drawingMode,
      showFloorPlanImage,
      mapImage,
      unitLabelFontSize,
      setSelectedElementId
    ]
  )

  const renderTemporaryDrawing = useCallback(
    (layer: D3Selection) => {
      newCoordinates.forEach((item, index) => {
        // Draw point
        layer
          .append('circle')
          .attr('cx', item.coords[0])
          .attr('cy', item.coords[1])
          .attr('r', pointRadius + 1)
          .attr('fill', COLORS.temporary)
          .attr('stroke', COLORS.white)
          .attr('stroke-width', Math.max(2, pointRadius * 0.25))
          .attr('class', 'temp-drawing-point')

        // Draw line segment from previous point (only for building outline mode)
        if (
          drawingMode === 'outline' &&
          index > 0 &&
          newCoordinates[index - 1]
        ) {
          renderLine(
            layer,
            newCoordinates[index - 1].coords,
            item.coords,
            COLORS.temporary,
            2,
            true
          )
        }
      })

      // Draw temporary polygon if there are points (units mode only)
      if (drawingMode === 'units' && newCoordinates.length > 2) {
        layer
          .append('polygon')
          .attr('points', newCoordinates.map(d => d.coords.join(',')).join(' '))
          .attr('fill', STYLES.temporaryFill)
          .attr('stroke', COLORS.temporary)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', STYLES.dashedLine)
      }
    },
    [newCoordinates, drawingMode, pointRadius, renderLine]
  )

  const renderClickablePoints = useCallback(
    (layer: D3Selection) => {
      if (!isDrawing) return

      const renderPoints = (coords: Point[]) => {
        coords.forEach(coord => {
          renderPoint(layer, coord, COLORS.clickable, 'clickable-point', () => {
            handlePointClick(coord)
          })
        })
      }

      if (drawingMode === 'units') {
        units.forEach(unit => {
          if (unit.id !== selectedElementId) {
            renderPoints(unit.coordinates)
          }
        })
      } else if (drawingMode === 'outline') {
        buildingOutlines.forEach(outline => {
          if (outline.id !== selectedElementId) {
            renderPoints(outline.segments)
          }
        })
      } else if (drawingMode === 'outline-circle') {
        buildingOutlineCircles.forEach(circle => {
          if (circle.id !== selectedElementId) {
            renderPoint(
              layer,
              circle.center,
              COLORS.clickable,
              'clickable-point',
              () => {
                handlePointClick(circle.center)
              }
            )
          }
        })
      }
    },
    [
      isDrawing,
      drawingMode,
      units,
      buildingOutlines,
      buildingOutlineCircles,
      selectedElementId,
      handlePointClick,
      renderPoint
    ]
  )

  const renderTemporaryCircle = useCallback(
    (layer: D3Selection) => {
      if (
        drawingMode !== 'outline-circle' ||
        !isDrawing ||
        newCoordinates.length === 0
      )
        return

      const center = newCoordinates[0].coords

      if (newCoordinates.length > 1) {
        const edgePoint = newCoordinates[1].coords

        const radius = Math.sqrt(
          Math.pow(edgePoint[0] - center[0], 2) +
            Math.pow(edgePoint[1] - center[1], 2)
        )

        // Draw the preview circle
        layer
          .append('circle')
          .attr('cx', center[0])
          .attr('cy', center[1])
          .attr('r', radius)
          .attr('fill', 'none')
          .attr('stroke', COLORS.temporary)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', STYLES.dashedLine)

        // Draw radius line
        renderLine(layer, center, edgePoint, COLORS.temporary, 2, true)
      }

      // Draw center point
      layer
        .append('circle')
        .attr('cx', center[0])
        .attr('cy', center[1])
        .attr('r', pointRadius + 1)
        .attr('fill', COLORS.temporary)
        .attr('stroke', COLORS.white)
        .attr('stroke-width', Math.max(2, pointRadius * 0.25))
    },
    [drawingMode, isDrawing, newCoordinates, pointRadius, renderLine]
  )

  const renderHighlightedCoord = useCallback(
    (layer: D3Selection) => {
      if (!highlightedCoord || isDrawing) return

      const unit = units.find(u => u.id === highlightedCoord.unitId)

      if (!unit || !unit.coordinates[highlightedCoord.index]) return

      const coord = unit.coordinates[highlightedCoord.index]

      layer
        .append('circle')
        .attr('cx', coord[0])
        .attr('cy', coord[1])
        .attr('r', pointRadius + 2)
        .attr('fill', COLORS.temporary)
        .attr('stroke', COLORS.white)
        .attr('stroke-width', Math.max(2, pointRadius * 0.25))
        .attr('class', 'highlighted-coordinate-point')
    },
    [highlightedCoord, isDrawing, units, pointRadius]
  )

  useEffect(() => {
    if (!gRef.current || !imageLoaded) return

    const g = d3.select(gRef.current)

    let polygonLayer = g.select<SVGGElement>('.polygon-layer')

    if (polygonLayer.empty()) {
      polygonLayer = g.append('g').attr('class', 'polygon-layer')
    }

    polygonLayer.selectAll('*').remove()

    // Render in correct order for proper layering
    if (drawingMode === 'outline') {
      renderOutlines(polygonLayer)
    } else if (drawingMode === 'outline-circle') {
      renderOutlineCircles(polygonLayer)
    } else if (drawingMode === 'amenity') {
      if (!isDrawing) {
        renderUnits(polygonLayer, false)
      }
      renderOutlines(polygonLayer)
      renderOutlineCircles(polygonLayer)
      renderAmenities(polygonLayer)
    }

    if (drawingMode === 'units') {
      renderUnits(polygonLayer, true)
      renderOutlines(polygonLayer)
      renderOutlineCircles(polygonLayer)
      renderAmenities(polygonLayer)
    }

    renderTemporaryDrawing(polygonLayer)
    renderClickablePoints(polygonLayer)
    renderTemporaryCircle(polygonLayer)
    renderHighlightedCoord(polygonLayer)
  }, [
    gRef,
    imageLoaded,
    drawingMode,
    renderOutlines,
    renderOutlineCircles,
    renderUnits,
    renderAmenities,
    renderTemporaryDrawing,
    renderClickablePoints,
    renderTemporaryCircle,
    renderHighlightedCoord,
    highlightedCoord
  ])
}
