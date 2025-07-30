import { Icon } from '@iconify/react/dist/iconify.js'
import * as d3 from 'd3'
import {
  Button,
  ColorInput,
  ConfirmationModal,
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  FileInput,
  LayoutWithSidebar,
  SidebarDivider,
  SidebarWrapper,
  SliderInput,
  Switch,
  useModalStore
} from 'lifeforge-ui'
import { useEffect, useRef, useState } from 'react'
import { usePersonalization } from 'shared'

import LineItem from './components/LineItem'
import ModifyLineModal from './components/ModifyLineModal'
import StationItem from './components/StationItem'

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

const D3MRTMap = () => {
  const open = useModalStore(state => state.open)

  const { bgTempPalette } = usePersonalization()

  const [colorOfCurrentLine, setColorOfCurrentLine] = useState(
    bgTempPalette[900]
  )

  const [currentPlotting, _setCurrentPlotting] = useState<'station' | 'line'>(
    'line'
  )

  const currentlyPlottingRef = useRef<'station' | 'line'>(currentPlotting)

  function setCurrentPlotting(plotting: 'station' | 'line') {
    currentlyPlottingRef.current = plotting
    _setCurrentPlotting(plotting)
  }

  const [bgImage, setBgImage] = useState<string | File | null>(null)

  const [bgImageScale, setBgImageScale] = useState(
    localStorage.getItem('bgImageScale')
      ? JSON.parse(localStorage.getItem('bgImageScale') ?? '100')
      : 100
  )

  const [bgImagePreview, setBgImagePreview] = useState<string | null>(null)

  const [showImage, setShowImage] = useState(
    localStorage.getItem('showMRTBgImage')
      ? JSON.parse(localStorage.getItem('showMRTBgImage') ?? 'true')
      : true
  )

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode')
      ? JSON.parse(localStorage.getItem('darkMode') ?? 'false')
      : false
  )

  const ref = useRef(null)

  const gRef = useRef(null)

  const [selectedLineIndex, _setSelectedLineIndex] = useState<number | null>(
    localStorage.getItem('mrtSelectedLineIndex')
      ? JSON.parse(localStorage.getItem('mrtSelectedLineIndex') ?? 'null')
      : null
  )

  const selectedLineIndexRef = useRef(selectedLineIndex)

  function setSelectedLineIndex(index: number | null) {
    selectedLineIndexRef.current = index
    _setSelectedLineIndex(index)
  }

  const [mrtStations, setMrtStations] = useState<
    {
      x: number
      y: number
      name: string
      lines: string[]
      type: 'station' | 'interchange'
      width: number
      height?: number
      rotate?: number
      textOffsetX?: number
      textOffsetY?: number
    }[]
  >(
    localStorage.getItem('mrtStations')
      ? JSON.parse(localStorage.getItem('mrtStations') ?? '[]')
      : []
  )

  const [mrtLines, setMrtLines] = useState<
    {
      color: string
      name: string
      path: [number, number][]
    }[]
  >(
    localStorage.getItem('mrtLines')
      ? JSON.parse(localStorage.getItem('mrtLines') ?? '[]')
      : []
  )

  useEffect(() => {
    const svg = d3.select(ref.current)

    const g = d3.select(gRef.current)

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.4, 4])
        .on('zoom', event => {
          g.attr('transform', event.transform)
        }) as never
    )

    svg.on('click', function (event) {
      if (event.defaultPrevented) return

      const [x, y] = d3.pointer(event, g.node())

      if (currentlyPlottingRef.current !== 'line') return

      if (selectedLineIndexRef.current === null) {
        return
      }

      setMrtLines(prevLines =>
        prevLines.map((line, index) => {
          if (index !== selectedLineIndexRef.current) return line

          return {
            ...line,
            path: [...line.path, [Math.round(x), Math.round(y)]]
          }
        })
      )
    })
  }, [])

  useEffect(() => {
    const g = d3.select(gRef.current)

    g.selectAll('*').remove()

    if (showImage && bgImagePreview) {
      g.append('svg:image')
        .attr('xlink:href', bgImagePreview)
        .attr('width', `${bgImageScale}%`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
    }

    for (let index = 0; index < mrtLines.length; index++) {
      const line = mrtLines[index]

      if (line.path.length === 0) continue

      const path = roundedPolygon(
        line.path.map(p => ({ x: p[0], y: p[1] })),
        5
      )

      g.append('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr(
          'stroke',
          selectedLineIndex === index ? colorOfCurrentLine : line.color
        )
        .attr('stroke-width', 5)
        .attr('stroke-linecap', 'round')
        .on('click', event => {
          event.stopPropagation()

          if (currentPlotting !== 'station') return

          const [x, y] = d3.pointer(event, g.node())

          setMrtStations(prevStations => [
            ...prevStations,
            {
              x: Math.round(x),
              y: Math.round(y),
              name: '',
              type: 'station' as const,
              lines: [line.name],
              rotate: 0,
              width: 1,
              height: 1,
              textOffsetX: 0,
              textOffsetY: 0
            }
          ])
        })
    }

    for (const station of mrtStations) {
      if (station.type === 'interchange') {
        g.append('rect')
          .attr('x', station.x - 10)
          .attr('y', station.y - 10)
          .attr('width', 20 * (station.width || 1))
          .attr('height', 20 * (station.height || 1))
          .attr('fill', bgTempPalette[darkMode ? 900 : 100])
          .attr('stroke', bgTempPalette[darkMode ? 100 : 800])
          .attr('stroke-width', 3)
          .attr('rx', 10)
          .attr('ry', 10)
          .attr(
            'transform',
            `rotate(${station.rotate}, ${station.x}, ${station.y})`
          )
      } else if (station.type === 'station') {
        g.append('circle')
          .attr('cx', station.x)
          .attr('cy', station.y)
          .attr('r', 6)
          .attr('fill', bgTempPalette[darkMode ? 900 : 100])
          .attr(
            'stroke',
            mrtLines.find(l => l.name === station.lines?.[0])?.color ||
              bgTempPalette[darkMode ? 100 : 800]
          )
          .attr('stroke-width', 2)
          .attr('onclick', `alert('${station.name}')`)
      }
      g.append('text')
        .attr('x', station.x + (station.textOffsetX || 0))
        .attr('y', station.y + (station.textOffsetY || 0))
        .attr('text-anchor', 'middle')
        .attr('fill', bgTempPalette[darkMode ? 100 : 800])
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 10)
        .attr('font-family', 'LTAIdentityMedium')
        .attr('white-space', 'pre')
        .attr('style', 'line-height: 1.2')
        .each(function () {
          const textElement = d3.select(this)

          const lines = station.name.split('\\n')

          lines.forEach((line: string, i: number) => {
            textElement
              .append('tspan')
              .attr('x', station.x + (station.textOffsetX || 0))
              .attr('dy', i === 0 ? '0em' : '1.2em')
              .text(line)
          })
        })
    }
  }, [
    mrtLines,
    mrtStations,
    showImage,
    bgImagePreview,
    darkMode,
    bgImageScale,
    colorOfCurrentLine,
    selectedLineIndex,
    currentPlotting
  ])

  useEffect(() => {
    document.body.onkeydown = e => {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()

        if (currentPlotting === 'line') {
          if (selectedLineIndex === null) return

          setMrtLines(prevLines =>
            prevLines.map((line, index) => {
              if (index !== selectedLineIndexRef.current) return line

              const newPath = [...line.path]

              newPath.pop()

              return { ...line, path: newPath }
            })
          )
        } else {
          const confirm = window.confirm(
            'Are you sure you want to remove the last station? This action cannot be undone.'
          )

          if (!confirm) return

          setMrtStations(prevStations => {
            const newStations = [...prevStations]

            newStations.pop()

            return newStations
          })
        }
      }
    }
  }, [selectedLineIndex, currentPlotting])

  useEffect(() => {
    localStorage.setItem('mrtLines', JSON.stringify(mrtLines))
    localStorage.setItem('mrtStations', JSON.stringify(mrtStations))
    localStorage.setItem('showMRTBgImage', JSON.stringify(showImage))
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    localStorage.setItem(
      'mrtSelectedLineIndex',
      JSON.stringify(selectedLineIndex)
    )
    localStorage.setItem('bgImageScale', JSON.stringify(bgImageScale))
  }, [
    mrtLines,
    mrtStations,
    showImage,
    darkMode,
    selectedLineIndex,
    bgImageScale
  ])

  return (
    <main
      className="bg-bg-200/50 text-bg-800 dark:bg-bg-900/50 dark:text-bg-50 flex h-dvh w-full flex-col p-8 pb-0"
      id="app"
    >
      <LayoutWithSidebar>
        <SidebarWrapper isOpen={true} setOpen={() => {}}>
          <div className="mb-4 flex items-center gap-4 px-4">
            <Icon className="text-2xl" icon="tabler:mouse" />
            <h2 className="text-xl font-medium">Currently Plotting</h2>
          </div>
          <div className="flex items-center gap-2 px-4">
            <Button
              className="w-full"
              icon="tabler:line"
              variant={currentPlotting === 'line' ? 'primary' : 'plain'}
              onClick={() => {
                setCurrentPlotting('line')
                setSelectedLineIndex(null)
              }}
            >
              Line
            </Button>
            <Button
              className="w-full"
              icon="tabler:train"
              variant={currentPlotting === 'station' ? 'primary' : 'plain'}
              onClick={() => {
                setCurrentPlotting('station')
                setSelectedLineIndex(null)
              }}
            >
              Station
            </Button>
          </div>
          <SidebarDivider />
          {currentPlotting === 'line' ? (
            <>
              <div className="flex-between mb-4 gap-4 px-4">
                <div className="flex items-center gap-4">
                  <Icon className="text-2xl" icon="tabler:route" />
                  <h2 className="text-xl font-medium">Lines</h2>
                </div>
                <Button
                  className="p-2!"
                  icon="tabler:plus"
                  variant="plain"
                  onClick={() => {
                    open(ModifyLineModal, {
                      type: 'create',
                      setLineData: setMrtLines
                    })
                  }}
                />
              </div>
              {mrtLines.length > 0 ? (
                <div className="space-y-3">
                  {mrtLines.map((line, index) => (
                    <LineItem
                      key={`line-${index}`}
                      currentPlotting={currentPlotting}
                      index={index}
                      line={line}
                      selectedLineIndex={selectedLineIndex}
                      setMrtLines={setMrtLines}
                      setSelectedLineIndex={setSelectedLineIndex}
                    />
                  ))}
                </div>
              ) : (
                <EmptyStateScreen
                  smaller
                  description="Click the button above to add a new MRT line."
                  icon="tabler:route-off"
                  name={false}
                  namespace={false}
                  title="No MRT Lines"
                />
              )}
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-4 px-4">
                <Icon className="text-2xl" icon="tabler:map-pin" />
                <h2 className="text-xl font-medium">Stations</h2>
              </div>
              <div className="flex flex-col px-4">
                <div className="flex-1">
                  {mrtStations.length > 0 ? (
                    <div className="space-y-3">
                      {mrtStations.map((station, index) => (
                        <StationItem
                          key={`station-${index}`}
                          index={index}
                          mrtLines={mrtLines}
                          setMrtStations={setMrtStations}
                          station={station}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyStateScreen
                      smaller
                      description="Click the button below to add a new MRT station."
                      icon="tabler:map-pin-off"
                      name={false}
                      namespace={false}
                      title="No MRT Stations"
                    />
                  )}
                </div>
              </div>
            </>
          )}
          <SidebarDivider />
          <div className="mb-4 flex items-center gap-4 px-4">
            <Icon className="text-2xl" icon="tabler:settings" />
            <h2 className="text-xl font-medium">Settings</h2>
          </div>
          <div className="space-y-4 px-4">
            <ColorInput
              className="w-full"
              color={colorOfCurrentLine}
              name="Color of Selected Line"
              namespace={false}
              setColor={setColorOfCurrentLine}
            />
            <FileInput
              enableUrl
              acceptedMimeTypes={{
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg']
              }}
              file={bgImage}
              icon="tabler:photo"
              name="Background Image"
              namespace={false}
              preview={bgImagePreview}
              setData={({ file, preview }) => {
                setBgImage(file)
                setBgImagePreview(preview)
              }}
            />
            <SliderInput
              icon="tabler:zoom-in-area"
              max={200}
              min={10}
              name="Background Image Scale"
              namespace={false}
              setValue={setBgImageScale}
              step={10}
              value={bgImageScale}
            />
            <div className="flex items-center justify-between">
              <div className="text-bg-500 flex items-center gap-2">
                <Icon className="size-6" icon="tabler:eye" />
                <span className="text-lg">Show background image</span>
              </div>
              <Switch
                checked={showImage}
                onChange={() => {
                  setShowImage(!showImage)
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-bg-500 flex items-center gap-2">
                <Icon className="size-6" icon="tabler:moon" />
                <span className="text-lg">Dark mode</span>
              </div>
              <Switch
                checked={darkMode}
                onChange={() => {
                  setDarkMode(!darkMode)
                }}
              />
            </div>
            <Button
              isRed
              className="mt-6 w-full"
              icon="tabler:trash"
              variant="secondary"
              onClick={() => {
                open(ConfirmationModal, {
                  title: 'Reset MRT Map',
                  description:
                    'Are you sure you want to reset the MRT map? This action cannot be undone.',
                  onConfirm: async () => {
                    setMrtLines([])
                    setMrtStations([])
                    setBgImage(null)
                    setBgImagePreview(null)
                    setShowImage(true)
                    setDarkMode(false)
                    setSelectedLineIndex(null)
                  }
                })
              }}
            >
              Reset MRT Map
            </Button>
          </div>
        </SidebarWrapper>
        <ContentWrapperWithSidebar>
          <div className="component-bg mb-8 h-full overflow-hidden rounded-lg">
            <svg
              ref={ref}
              height="100%"
              style={{ touchAction: 'none' }}
              width="100%"
            >
              <g ref={gRef}></g>
            </svg>
          </div>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </main>
  )
}

export default D3MRTMap
