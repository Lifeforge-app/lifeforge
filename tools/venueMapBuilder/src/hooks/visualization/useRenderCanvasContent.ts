import * as d3 from 'd3'
import { useCallback, useEffect, useMemo } from 'react'

import { useAmenities } from '../../providers/AmenitiesProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'
import { useSettings } from '../../providers/SettingsProvider'
import type {
  Coordinate,
  CoordinateWithSnapInfo,
  HighlightedCoord
} from '../../types'
import { calculateCenter, closestPointOnPolygon } from '../../utils/unitUtils'

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
  textLight: '#fff',
  pathNode: '#8b5cf6',
  pathNodeConnected: '#f97316',
  pathLine: '#6366f1',
  pathStart: '#10b981',
  pathEnd: '#ef4444',
  pathIntermediate: '#3b82f6'
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
  onPathNodeClick?: (nodeId: string) => void
}

export default function useRenderCanvasContent({
  imageLoaded,
  highlightedCoord,
  newCoordinates,
  onPathNodeClick
}: RenderCanvasContentProps) {
  const { gRef, svgRef } = useSVGRefContext()

  const {
    selectedElementId,
    setSelectedElementId,
    drawingMode,
    isDrawing,
    isSettingEntrance,
    setIsSettingEntrance,
    isConnectingNodes,
    displayedPath,
    addPoint
  } = useDrawing()

  const {
    showFloorPlanImage,
    unitLabelFontSize,
    pointRadius,
    amenityChipSize,
    showUnit,
    showUnitOutline,
    showPaths,
    showAmenities,
    showEntrances
  } = useSettings()

  const { amenityTypes } = useAmenities()

  const {
    selectedFloor: {
      floorPlanImage: mapImage,
      units,
      buildingOutlines,
      buildingOutlineCircles,
      amenities,
      pathNodes
    },
    selectedFloor,
    updateFloor
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
    (layer: D3Selection, clickable: boolean = true) => {
      buildingOutlines.forEach(outline => {
        if (outline.segments.length < 2) return

        const isSelected = outline.id === selectedElementId

        const shouldRender =
          !isDrawing ||
          (isDrawing && drawingMode === 'outline'
            ? !isSelected
            : showUnitOutline)

        if (!shouldRender) return

        // Draw line segments
        for (let i = 0; i < outline.segments.length - 1; i++) {
          const lineElement = layer
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

          if (clickable) {
            lineElement
              .style('cursor', 'pointer')
              .on('click', (event: PointerEvent) => {
                event.stopPropagation()

                if (!isDrawing && drawingMode === 'outline') {
                  setSelectedElementId(outline.id)
                }
              })
          }
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
      renderPoint,
      showUnitOutline
    ]
  )

  const renderOutlineCircles = useCallback(
    (layer: D3Selection, clickable: boolean = true) => {
      buildingOutlineCircles.forEach(circle => {
        const isSelected = circle.id === selectedElementId

        const shouldRender =
          !isDrawing ||
          (isDrawing && drawingMode === 'outline-circle'
            ? !isSelected
            : showUnitOutline)

        if (!shouldRender) return

        // Draw the circle
        const circleElement = layer
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
          .attr('class', 'outline-circle')

        if (clickable) {
          circleElement
            .style('cursor', 'pointer')
            .on('click', (event: PointerEvent) => {
              event.stopPropagation()

              if (!isDrawing && drawingMode === 'outline-circle') {
                setSelectedElementId(circle.id)
              }
            })
        }

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
      renderLine,
      showUnitOutline
    ]
  )

  const renderAmenities = useCallback(
    (layer: D3Selection, clickable: boolean = true) => {
      amenities.forEach(amenity => {
        const amenityType = amenityTypes.find(
          t => t.id === amenity.amenityTypeId
        )

        if (!amenityType) return

        const isSelected = amenity.id === selectedElementId

        const shouldRender =
          !isDrawing ||
          (isDrawing && drawingMode === 'amenity' ? !isSelected : showAmenities)

        if (!shouldRender) return

        const iconSize = amenityChipSize

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

        if (clickable) {
          amenityGroup
            .style('cursor', 'pointer')
            .on('click', (event: PointerEvent) => {
              event.stopPropagation()

              if (!isDrawing && drawingMode === 'amenity') {
                setSelectedElementId(amenity.id)
              }
            })
        }

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
      renderPoint,
      showAmenities,
      amenityChipSize
    ]
  )

  const renderPathNodes = useCallback(
    (layer: D3Selection, clickable: boolean) => {
      // Don't render path nodes/connections when a path is being displayed
      if (displayedPath) return

      // Render connections first (so they appear behind nodes)
      pathNodes.forEach(node => {
        node.connectedNodeIds.forEach(connectedId => {
          const shouldRender =
            !isDrawing ||
            (isDrawing && drawingMode === 'path'
              ? node.id === selectedElementId
              : showPaths)

          if (!shouldRender) return

          const connectedNode = pathNodes.find(n => n.id === connectedId)

          if (!connectedNode) return

          // Only render each connection once (when current node id < connected node id)
          if (node.id >= connectedId) return

          layer
            .append('line')
            .attr('x1', node.coordinate[0])
            .attr('y1', node.coordinate[1])
            .attr('x2', connectedNode.coordinate[0])
            .attr('y2', connectedNode.coordinate[1])
            .attr('stroke', COLORS.pathLine)
            .attr('stroke-width', 3)
            .attr('opacity', 0.6)
        })
      })

      // Render nodes
      pathNodes.forEach(node => {
        const isSelected = node.id === selectedElementId

        const shouldRender =
          !isDrawing ||
          (isDrawing && drawingMode === 'path' ? !isSelected : showPaths)

        if (!shouldRender) return

        const nodeRadius = pointRadius * 1.5

        // In connecting mode, highlight connected/connectable nodes
        const selectedPathNode = pathNodes.find(n => n.id === selectedElementId)

        const isConnectedToSelected =
          isConnectingNodes &&
          selectedPathNode &&
          selectedPathNode.connectedNodeIds.includes(node.id)

        const nodeColor = isSelected
          ? COLORS.selected
          : isConnectedToSelected
            ? COLORS.pathNodeConnected
            : COLORS.pathNode

        const circle = layer
          .append('circle')
          .attr('cx', node.coordinate[0])
          .attr('cy', node.coordinate[1])
          .attr('r', nodeRadius)
          .attr('fill', nodeColor)
          .attr('stroke', COLORS.white)
          .attr('stroke-width', Math.max(2, nodeRadius * 0.25))

        // Add visual feedback in connecting mode
        if (
          isConnectingNodes &&
          selectedElementId &&
          node.id !== selectedElementId
        ) {
          if (isConnectedToSelected) {
            // Already connected - make it semi-transparent and non-clickable
            circle.attr('opacity', 0.4).style('cursor', 'not-allowed')
          } else {
            // Not connected - make it slightly transparent and clickable
            circle.attr('opacity', 0.7)
          }
        }

        // Make node clickable only if it's not already connected (when in connecting mode)
        const isClickableNode =
          clickable &&
          (!isConnectingNodes || !selectedElementId || !isConnectedToSelected)

        if (isClickableNode) {
          circle
            .style('cursor', 'pointer')
            .on('click', (event: PointerEvent) => {
              event.stopPropagation()

              if (isConnectingNodes && onPathNodeClick) {
                // In connecting mode, call the callback to toggle connection
                onPathNodeClick(node.id)
              } else if (!isDrawing && drawingMode === 'path') {
                // Normal mode - select the node
                setSelectedElementId(node.id)
              }
            })
        } else if (isConnectedToSelected) {
          // For non-clickable nodes, prevent click from propagating
          circle.on('click', (event: PointerEvent) => {
            event.stopPropagation()
            // Do nothing - node is already connected
          })
        }

        // Draw point when selected and not drawing
        if (isSelected && !isDrawing) {
          renderPoint(layer, node.coordinate, COLORS.selected)
        }
      })
    },
    [
      pathNodes,
      selectedElementId,
      isDrawing,
      drawingMode,
      pointRadius,
      isConnectingNodes,
      onPathNodeClick,
      setSelectedElementId,
      renderPoint,
      showPaths
    ]
  )

  const renderDisplayedPath = useCallback(
    (layer: D3Selection) => {
      if (!displayedPath || displayedPath.length < 2) return

      // Draw the path as a thick line
      for (let i = 0; i < displayedPath.length - 1; i++) {
        layer
          .append('line')
          .attr('x1', displayedPath[i][0])
          .attr('y1', displayedPath[i][1])
          .attr('x2', displayedPath[i + 1][0])
          .attr('y2', displayedPath[i + 1][1])
          .attr('stroke', COLORS.pathLine)
          .attr('stroke-width', 5)
          .attr('stroke-linecap', 'round')
          .attr('opacity', 0.9)
      }

      // Draw markers at each point
      displayedPath.forEach((point, index) => {
        const isStart = index === 0

        const isEnd = index === displayedPath.length - 1

        const radius = isStart || isEnd ? pointRadius * 2.5 : pointRadius * 1.5

        layer
          .append('circle')
          .attr('cx', point[0])
          .attr('cy', point[1])
          .attr('r', radius)
          .attr(
            'fill',
            isStart
              ? COLORS.pathStart
              : isEnd
                ? COLORS.pathEnd
                : COLORS.pathIntermediate
          )
          .attr('stroke', COLORS.white)
          .attr('stroke-width', Math.max(3, radius * 0.3))
      })
    },
    [displayedPath, pointRadius]
  )

  const renderUnits = useCallback(
    (layer: D3Selection, clickable: boolean) => {
      sortedUnits.forEach(unit => {
        if (unit.coordinates.length < 3) return

        const isSelected = unit.id === selectedElementId

        const shouldRender =
          !isDrawing ||
          (isDrawing && drawingMode === 'units' ? !isSelected : showUnit)

        if (!shouldRender) return

        const isEntranceSettingMode =
          isSettingEntrance && isSelected && drawingMode === 'units'

        layer
          .append('polygon')
          .attr('points', unit.coordinates.map(d => d.join(',')).join(' '))
          .attr(
            'fill',
            isSelected ? STYLES.selectedFill : STYLES.defaultUnitFill
          )
          .attr('stroke', isSelected ? COLORS.selected : COLORS.defaultUnit)
          .attr('stroke-width', isEntranceSettingMode ? 5 : isSelected ? 3 : 2)
          .style(
            'cursor',
            clickable || isEntranceSettingMode
              ? 'pointer'
              : (null as unknown as string)
          )
          .on(
            'click',
            clickable || isEntranceSettingMode
              ? (event: PointerEvent) => {
                  event.stopPropagation()

                  if (isEntranceSettingMode && gRef.current && svgRef.current) {
                    // Get the click coordinates
                    const transform = d3.zoomTransform(gRef.current)

                    const rect = svgRef.current.getBoundingClientRect()

                    const x =
                      (event.clientX - rect.left - transform.x) / transform.k

                    const y =
                      (event.clientY - rect.top - transform.y) / transform.k

                    const clickPoint: [number, number] = [x, y]

                    // Find the closest point on the polygon outline
                    const snappedPoint = closestPointOnPolygon(
                      clickPoint,
                      unit.coordinates
                    )

                    // Update the entrance location
                    if (selectedFloor) {
                      updateFloor(selectedFloor.id, {
                        units: selectedFloor.units.map(u =>
                          u.id === unit.id
                            ? { ...u, entranceLocation: snappedPoint }
                            : u
                        )
                      })
                    }

                    setIsSettingEntrance(false)
                  } else if (!isDrawing && drawingMode === 'units') {
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

        // Add entrance location marker
        if (unit.entranceLocation && (showEntrances || isSelected)) {
          const [entranceX, entranceY] = unit.entranceLocation

          // Draw a circle for the entrance
          layer
            .append('circle')
            .attr('cx', entranceX)
            .attr('cy', entranceY)
            .attr('r', 8)
            .attr('fill', '#22c55e')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .style(
              'cursor',
              clickable ? 'pointer' : (null as unknown as string)
            )

          // Draw an arrow/door icon
          layer
            .append('path')
            .attr(
              'd',
              `M ${entranceX - 4} ${entranceY - 2} L ${entranceX} ${entranceY + 4} L ${entranceX + 4} ${entranceY - 2}`
            )
            .attr('fill', 'none')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .attr('pointer-events', 'none')
        }
      })
    },
    [
      sortedUnits,
      selectedElementId,
      isDrawing,
      isSettingEntrance,
      drawingMode,
      showFloorPlanImage,
      mapImage,
      unitLabelFontSize,
      showEntrances,
      setSelectedElementId,
      setIsSettingEntrance,
      selectedFloor,
      updateFloor,
      gRef,
      svgRef,
      showUnit
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

      let coord: Coordinate | undefined

      if (highlightedCoord.type === 'unit') {
        const unit = units.find(u => u.id === highlightedCoord.elementId)

        if (!unit || !unit.coordinates[highlightedCoord.index]) return

        coord = unit.coordinates[highlightedCoord.index]
      } else if (highlightedCoord.type === 'outline') {
        const outline = buildingOutlines.find(
          o => o.id === highlightedCoord.elementId
        )

        if (!outline || !outline.segments[highlightedCoord.index]) return

        coord = outline.segments[highlightedCoord.index]
      }

      if (!coord) return

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
    [highlightedCoord, isDrawing, units, buildingOutlines, pointRadius]
  )

  useEffect(() => {
    if (!gRef.current || !imageLoaded) return

    const g = d3.select(gRef.current)

    let polygonLayer = g.select<SVGGElement>('.polygon-layer')

    if (polygonLayer.empty()) {
      polygonLayer = g.append('g').attr('class', 'polygon-layer')
    }

    polygonLayer.selectAll('*').remove()

    // When a path is displayed, make everything non-clickable
    const isPathDisplayed = !!displayedPath

    // Render in correct order for proper layering
    // In drawing mode: render everything for context
    // In non-drawing mode: respect user toggles

    // Render units (always show in units mode or when drawing, toggle otherwise)
    if (drawingMode === 'units') {
      renderUnits(polygonLayer, !isPathDisplayed)
    } else if (isDrawing || showUnit) {
      renderUnits(polygonLayer, false)
    }

    // Render amenities (always show in amenity mode or when drawing, toggle otherwise)
    if (drawingMode === 'amenity') {
      renderAmenities(polygonLayer, !isPathDisplayed)
    } else if (isDrawing || showAmenities) {
      renderAmenities(polygonLayer, false)
    }

    // Render outlines (always show in outline mode or when drawing, toggle otherwise)
    if (drawingMode === 'outline') {
      renderOutlines(polygonLayer, !isPathDisplayed)
    } else if (isDrawing || showUnitOutline) {
      renderOutlines(polygonLayer, false)
    }

    // Render outline circles (always show in outline-circle mode or when drawing, toggle otherwise)
    if (drawingMode === 'outline-circle') {
      renderOutlineCircles(polygonLayer, !isPathDisplayed)
    } else if (isDrawing || showUnitOutline) {
      renderOutlineCircles(polygonLayer, false)
    }

    // Render path nodes (always show in path mode or when drawing, toggle otherwise)
    if (drawingMode === 'path') {
      renderPathNodes(polygonLayer, !isPathDisplayed)
    } else if (isDrawing || showPaths) {
      renderPathNodes(polygonLayer, false)
    }

    renderTemporaryDrawing(polygonLayer)
    renderClickablePoints(polygonLayer)
    renderTemporaryCircle(polygonLayer)
    renderHighlightedCoord(polygonLayer)

    // Render the displayed path on top of everything else
    if (displayedPath) {
      renderDisplayedPath(polygonLayer)
    }
  }, [
    gRef,
    imageLoaded,
    drawingMode,
    isDrawing,
    displayedPath,
    showUnit,
    showUnitOutline,
    showPaths,
    showAmenities,
    showEntrances,
    renderOutlines,
    renderOutlineCircles,
    renderUnits,
    renderAmenities,
    renderPathNodes,
    renderDisplayedPath,
    renderTemporaryDrawing,
    renderClickablePoints,
    renderTemporaryCircle,
    renderHighlightedCoord,
    highlightedCoord
  ])
}
