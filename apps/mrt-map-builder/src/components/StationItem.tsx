import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import {
  Button,
  ConfirmationModal,
  HamburgerMenu,
  ListboxInput,
  ListboxOption,
  MenuItem,
  NumberInput,
  SliderInput,
  TagsInput,
  TextInput,
  useModalStore
} from 'lifeforge-ui'
import _ from 'lodash'
import React, { useState } from 'react'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import type { Line, Station } from '../typescript/mrt.interfaces'

function StationItem({
  station,
  mrtLines,
  setMrtStations
}: {
  station: Station
  mrtLines: Line[]
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
}) {
  const open = useModalStore(state => state.open)

  const { bgTempPalette } = usePersonalization()

  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className="border-bg-200 dark:border-bg-800 rounded-lg border-2 p-4">
      <div className="flex-between gap-6">
        <div className="flex w-full min-w-0 items-center gap-2">
          <Icon
            className="text-bg-500 size-6 shrink-0"
            icon={
              station.type === 'station' ? 'tabler:map-pin' : 'tabler:exchange'
            }
          />
          <div className="min-w-0 truncate text-lg font-medium">
            {station.name || 'Unnamed Station'}
          </div>
          <div className="flex items-center gap-1">
            {(station.lines || []).length > 0 &&
              station.lines.sort().map(line => (
                <span
                  key={line}
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor:
                      mrtLines.find(l => l.name === line)?.color ?? '#333'
                  }}
                />
              ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className={`p-2! ${collapsed ? 'rotate-180' : ''} transition-transform`}
            icon="tabler:chevron-down"
            variant="plain"
            onClick={() => {
              setCollapsed(!collapsed)
            }}
          />
          <HamburgerMenu
            classNames={{
              button: 'p-2!'
            }}
          >
            <MenuItem icon="tabler:edit" text="Edit Line" onClick={() => {}} />
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete Line"
              onClick={() => {
                open(ConfirmationModal, {
                  title: 'Delete Station',
                  description: `Are you sure you want to delete the station "${station.name}"? This action cannot be undone.`,
                  buttonType: 'delete',
                  onConfirm: async () => {
                    setMrtStations(prevStations =>
                      prevStations.filter(s => s.id !== station.id)
                    )
                  }
                })
              }}
            />
          </HamburgerMenu>
        </div>
      </div>
      {!collapsed && (
        <div className="mt-4 space-y-3">
          <TagsInput
            icon="tabler:code"
            name="Station Codes"
            namespace={false}
            placeholder="Enter station codes..."
            renderTags={(tag, tagIndex, onRemove) => (
              <div
                key={tagIndex}
                className="flex items-center rounded-full pt-0.5 pr-2 pb-1 pl-3"
                style={{
                  backgroundColor:
                    mrtLines.find(l => l.code.slice(0, 2) === tag.slice(0, 2))
                      ?.color ?? '#ccc',
                  color: tinycolor(
                    mrtLines.find(l => l.code.slice(0, 2) === tag.slice(0, 2))
                      ?.color ?? '#ccc'
                  ).isDark()
                    ? bgTempPalette[100]
                    : bgTempPalette[800]
                }}
              >
                <span className="mr-2 font-[LTAIdentityMedium] text-sm">
                  {tag}
                </span>
                <Button
                  className={clsx(
                    'mt-0.5 p-1! hover:bg-transparent',
                    tinycolor(
                      mrtLines.find(l => l.code.slice(0, 2) === tag.slice(0, 2))
                        ?.color ?? '#ccc'
                    ).isDark()
                      ? 'text-bg-100!'
                      : 'text-bg-800!'
                  )}
                  icon="tabler:x"
                  iconClassName="size-4!"
                  variant="plain"
                  onClick={onRemove}
                />
              </div>
            )}
            setValue={codes => {
              setMrtStations(prevStations =>
                prevStations.map(s => {
                  if (s.id === station.id) {
                    return { ...s, codes }
                  }

                  return s
                })
              )
            }}
            value={station.codes || []}
          />
          <ListboxInput
            buttonContent={
              <div className="flex items-center gap-2">
                <Icon
                  className="text-lg"
                  icon={
                    station.type === 'station'
                      ? 'tabler:map-pin'
                      : 'tabler:exchange'
                  }
                />
                <span className="text-base font-medium">
                  {_.upperFirst(station.type)}
                </span>
              </div>
            }
            className="w-full"
            icon="tabler:category"
            name="Station Type"
            namespace={false}
            setValue={value => {
              setMrtStations(prevStations =>
                prevStations.map(s => {
                  if (s.id === station.id) {
                    return { ...s, type: value }
                  }

                  return s
                })
              )
            }}
            value={station.type}
          >
            {[
              {
                value: 'station',
                text: 'Station',
                icon: 'tabler:map-pin'
              },
              {
                value: 'interchange',
                text: 'Interchange',
                icon: 'tabler:exchange'
              }
            ].map(option => (
              <ListboxOption
                key={option.value}
                icon={option.icon}
                text={option.text}
                value={option.value}
              />
            ))}
          </ListboxInput>
          <ListboxInput
            multiple
            buttonContent={
              <div className="flex flex-wrap items-center gap-2">
                {(station.lines || []).length > 0 ? (
                  station.lines.map(line => (
                    <div key={line} className="flex items-center gap-2">
                      <span
                        key={line}
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor:
                            mrtLines.find(l => l.name === line)?.color ?? '#333'
                        }}
                      />
                      <span className="max-w-56 truncate text-base font-medium">
                        {line}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-bg-500">No lines selected</span>
                )}
              </div>
            }
            icon="tabler:route"
            name="Lines"
            namespace={false}
            setValue={value => {
              setMrtStations(prevStations =>
                prevStations.map(s => {
                  if (s.id === station.id) {
                    return { ...s, lines: value }
                  }

                  return s
                })
              )
            }}
            value={station.lines ?? []}
          >
            {mrtLines.map(line => (
              <ListboxOption
                key={line.name}
                color={line.color}
                icon="tabler:route"
                text={line.name}
                value={line.name}
              />
            ))}
          </ListboxInput>
          <TextInput
            className="flex-1"
            icon="tabler:map-pin"
            name="Station Name"
            namespace={false}
            placeholder="Station Name"
            setValue={value => {
              setMrtStations(prevStations =>
                prevStations.map(s => {
                  if (s.id === station.id) {
                    return { ...s, name: value }
                  }

                  return s
                })
              )
            }}
            value={station.name}
          />
          <NumberInput
            className="flex-1"
            icon="tabler:square-letter-x"
            name="X Coordinate"
            namespace={false}
            placeholder="X Coordinate"
            setValue={value => {
              setMrtStations(prevStations =>
                prevStations.map(s => {
                  if (s.id === station.id) {
                    return { ...s, x: value }
                  }

                  return s
                })
              )
            }}
            value={station.x}
          />
          <NumberInput
            className="flex-1"
            icon="tabler:square-letter-y"
            name="Y Coordinate"
            namespace={false}
            placeholder="Y Coordinate"
            setValue={value => {
              setMrtStations(prevStations =>
                prevStations.map(s => {
                  if (s.id === station.id) {
                    return { ...s, y: value }
                  }

                  return s
                })
              )
            }}
            value={station.y}
          />
          {station.type === 'interchange' && (
            <>
              <NumberInput
                className="flex-1"
                icon="tabler:arrows-horizontal"
                name="Width"
                namespace={false}
                placeholder="Width"
                setValue={value => {
                  setMrtStations(prevStations =>
                    prevStations.map(s => {
                      if (s.id === station.id) {
                        return { ...s, width: value }
                      }

                      return s
                    })
                  )
                }}
                value={station.width}
              />
              <NumberInput
                className="flex-1"
                icon="tabler:arrows-vertical"
                name="Height"
                namespace={false}
                placeholder="Height"
                setValue={value => {
                  setMrtStations(prevStations =>
                    prevStations.map(s => {
                      if (s.id === station.id) {
                        return { ...s, height: value }
                      }

                      return s
                    })
                  )
                }}
                value={station.height ?? 1}
              />
              <NumberInput
                className="flex-1"
                icon="tabler:rotate-2"
                name="Rotation"
                namespace={false}
                placeholder="Rotation"
                setValue={value => {
                  setMrtStations(prevStations =>
                    prevStations.map(s => {
                      if (s.id === station.id) {
                        return { ...s, rotate: value }
                      }

                      return s
                    })
                  )
                }}
                value={station.rotate ?? 0}
              />
            </>
          )}
          <SliderInput
            className="flex-1"
            icon="tabler:arrows-move-horizontal"
            max={100}
            min={-100}
            name="Text Offset X"
            namespace={false}
            setValue={value => {
              setMrtStations(prevStations =>
                prevStations.map(s => {
                  if (s.id === station.id) {
                    return { ...s, textOffsetX: value }
                  }

                  return s
                })
              )
            }}
            value={station.textOffsetX ?? 0}
          />
          <SliderInput
            className="flex-1"
            icon="tabler:arrows-move-vertical"
            max={100}
            min={-100}
            name="Text Offset Y"
            namespace={false}
            setValue={value => {
              setMrtStations(prevStations =>
                prevStations.map(s => {
                  if (s.id === station.id) {
                    return { ...s, textOffsetY: value }
                  }

                  return s
                })
              )
            }}
            value={station.textOffsetY ?? 0}
          />
        </div>
      )}
    </div>
  )
}

export default StationItem
