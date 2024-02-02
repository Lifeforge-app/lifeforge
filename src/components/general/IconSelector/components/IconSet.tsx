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

export interface IIconSetData {
  title: string
  total: number
  prefix: string
  uncategorized: string[]
  categories: Record<string, string[]>
}

async function getIconSet(prefix: string): Promise<any> {
  try {
    const res: IIconSetData = await fetch(
      `https://api.iconify.design/collection?prefix=${prefix}`
    ).then(async res => await res.json())

    console.log(res)
    if (!res.uncategorized) {
      res.uncategorized = Object.values(res.categories).flat()
    }

    return res
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
  const [currentTag, setCurrentTag] = useState<string | null>(null)
  const [iconData, setIconData] = useState<IIconSetData | null>(null)
  const [filteredIconList, setFilteredIconList] = useState<string[]>([])

  useEffect(() => {
    getIconSet(iconSet).then(data => {
      setIconData(data)
      setFilteredIconList(data.uncategorized)
    })
  }, [])

  useEffect(() => {
    if (iconData) {
      if (currentTag) {
        setFilteredIconList(
          iconData.categories[currentTag].filter(icon =>
            icon.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      } else {
        setFilteredIconList(
          iconData.uncategorized.filter(icon =>
            icon.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      }
    }
  }, [searchTerm, currentTag, iconData])

  return iconData ? (
    <div className="flex min-h-0 w-full flex-col overflow-scroll p-8">
      <h1 className="mb-6 flex flex-col items-center gap-1 text-center text-3xl font-semibold tracking-wide sm:inline">
        {iconData.title}
      </h1>
      <Input
        value={searchTerm}
        setValue={setSearchTerm}
        placeholder={`Search ${iconData.total.toLocaleString()} icons`}
        icon="uil:search"
      />
      {Object.keys(iconData.categories || {}).length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.keys(iconData.categories).map(
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
                      ? '!bg-bg-200 !text-bg-800 shadow-md'
                      : ''
                  } flex h-8 grow items-center justify-center whitespace-nowrap rounded-full bg-bg-800 px-6 text-sm text-bg-100 shadow-md transition-all md:grow-0`}
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
              setSelectedIcon(`${iconSet}:${icon}`)
              setOpen(false)
            }}
            className="flex cursor-pointer flex-col items-center rounded-lg p-4 transition-all hover:bg-bg-800"
          >
            <Icon icon={`${iconSet}:${icon}`} width="32" height="32" />
            <p className="-mb-0.5 mt-4 break-all  text-center text-xs font-medium tracking-wide">
              {icon.replace(/-/g, ' ')}
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
