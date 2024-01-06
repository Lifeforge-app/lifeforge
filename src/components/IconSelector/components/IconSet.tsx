/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Input from './Input'

async function getIconSet(iconSet: {
  iconlist: any
  version: any
  name: any
  iconCount: any
  tags: any
}): Promise<any> {
  try {
    const res = await fetch(
      `https://cors-anywhere.thecodeblog.net/icon-sets.iconify.design/assets/collection.${iconSet}.js`
    )
    let data = await res.text()
    data = JSON.parse(data.match(/=(.+);/)[1])
    const iconlist = data.icons
    const version = data.info.version || '1.0.0'
    const { name } = data.info
    const iconCount = data.info.total
    const tags = data.tags || []

    return {
      iconlist,
      version,
      name,
      iconCount,
      tags
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

function IconSet({
  setOpen,
  iconSet,
  setSelectedIcon
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  iconSet: string
  setSelectedIcon: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentTag, setCurrentTag] = useState(null)
  const [iconData, setIconData] = useState(null)
  const [filteredIconList, setFilteredIconList] = useState([])

  useEffect(() => {
    getIconSet(iconSet).then(data => {
      setIconData(data)
      setFilteredIconList(data.iconlist)
    })
  }, [])

  useEffect(() => {
    if (iconData) {
      setFilteredIconList(
        iconData.iconlist.filter(
          icon =>
            (icon.name || icon)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) &&
            (currentTag ? icon.tags.includes(currentTag) : true)
        )
      )
    }
  }, [searchTerm, currentTag, iconData])

  return iconData ? (
    <div className="flex min-h-0 w-full flex-col overflow-scroll p-8">
      <h1 className="mb-6 flex flex-col items-center gap-1 text-center text-3xl font-semibold tracking-wide sm:inline">
        {iconData.name}
        <span className="text-base sm:ml-2">v{iconData.version}</span>
      </h1>
      <Input
        value={searchTerm}
        setValue={setSearchTerm}
        placeholder={`Search ${iconData.iconCount.toLocaleString()} icons`}
        icon="uil:search"
      />
      {iconData.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {iconData.tags.sort().map(
            tag =>
              tag && (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setCurrentTag(currentTag === tag ? null : tag)
                  }}
                  className={`${
                    currentTag === tag
                      ? 'bg-neutral-200 text-neutral-800 shadow-md'
                      : ''
                  } flex h-8 grow items-center justify-center whitespace-nowrap rounded-full bg-neutral-800 px-6 text-sm text-neutral-100 shadow-md transition-all md:grow-0`}
                >
                  {tag}
                </button>
              )
          )}
        </div>
      )}
      <div className="mt-8 grid min-h-0 w-full grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 pb-8">
        {filteredIconList.map(icon => (
          <button
            key={icon}
            type="button"
            onClick={() => {
              setSelectedIcon(`${iconSet}:${icon.name || icon}`)
              setOpen(false)
            }}
            className="flex cursor-pointer flex-col items-center rounded-lg p-4 transition-all hover:bg-neutral-800"
          >
            <Icon
              icon={`${iconSet}:${icon.name || icon}`}
              width="32"
              height="32"
            />
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

export default IconSet
