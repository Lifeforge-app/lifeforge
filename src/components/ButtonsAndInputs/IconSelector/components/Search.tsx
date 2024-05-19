/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/require-array-sort-compare */

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Input from './Input'

async function getIconSet(searchTerm: string): Promise<any> {
  try {
    const res = await fetch(
      `https://cors-anywhere.thecodeblog.net/api.iconify.design/search?query=${searchTerm}&limit=9999`
    )
    const data = await res.json()
    let iconList = []
    if (data.icons.length) {
      iconList = data.icons
    } else {
      iconList = []
    }
    const iconSets = data.collections

    return {
      iconList,
      iconSets
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

function Search({
  setOpen,
  searchTerm,
  setSelectedIcon,
  setCurrentIconSet: setCurrentIconSetProp
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchTerm: string
  setSelectedIcon: React.Dispatch<React.SetStateAction<string>>
  setCurrentIconSet: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    }>
  >
}): React.ReactElement {
  const [currentIconSet, setCurrentIconSet] = useState(null)
  const [iconData, setIconData] = useState(null)
  const [filteredIconList, setFilteredIconList] = useState([])
  const [searchQuery, setSearchQuery] = useState(searchTerm || '')

  useEffect(() => {
    setIconData(null)
    getIconSet(searchTerm)
      .then(data => {
        setIconData(data)
        setFilteredIconList(data.iconList)
        setCurrentIconSet(null)
      })
      .catch(err => {
        console.error(err)
      })
  }, [searchTerm])

  useEffect(() => {
    if (iconData) {
      setFilteredIconList(
        currentIconSet
          ? iconData.iconList.filter(
              e => e.split(':').shift() === currentIconSet
            )
          : iconData.iconList
      )
    }
  }, [currentIconSet, iconData])

  return iconData ? (
    <div className="flex min-h-0 w-full flex-col overflow-scroll p-8">
      <div className="flex w-full gap-2">
        <Input
          value={searchQuery}
          setValue={setSearchQuery}
          placeholder="Search icons"
          icon="uil:search"
        />
        <button
          type="button"
          onClick={() => {
            if (searchQuery) setCurrentIconSetProp({ search: searchQuery })
          }}
          className="flex flex-center gap-1 rounded-md bg-bg-200 px-6 py-4 font-medium text-bg-800 shadow-md transition-all hover:bg-[#b3bdc9]"
        >
          Search
          <Icon icon="uil:arrow-right" className="h-5 w-5 text-bg-800" />
        </button>
      </div>
      {Object.keys(iconData.iconSets).length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.entries(iconData.iconSets)
            .sort()
            .map(([name, iconSet]) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setCurrentIconSet(currentIconSet === name ? null : name)
                }}
                className={`${
                  currentIconSet === name
                    ? 'bg-bg-200 text-bg-800 shadow-md'
                    : 'bg-bg-800'
                } flex h-8 grow flex-center whitespace-nowrap rounded-full px-6 text-sm text-bg-100 shadow-md transition-all md:grow-0`}
              >
                {iconSet.name}
              </button>
            ))}
        </div>
      )}
      <div className=" mt-6 grid min-h-0 grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 pb-8">
        {filteredIconList.map(icon => (
          <button
            key={icon}
            type="button"
            onClick={() => {
              setSelectedIcon(icon.name || icon)
              setOpen(false)
            }}
            className="flex cursor-pointer flex-col items-center rounded-lg p-4 transition-all hover:bg-bg-800"
          >
            <Icon icon={icon.name || icon} width="32" height="32" />
            <p className="-mb-0.5 mt-4 break-all  text-center text-xs font-medium tracking-wide">
              {(icon.name || icon).replace(/-/g, ' ')}
            </p>
          </button>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex w-full justify-center pb-8">
      <Icon icon="svg-spinners:270-ring" className="h-8 w-8" />
    </div>
  )
}

export default Search
