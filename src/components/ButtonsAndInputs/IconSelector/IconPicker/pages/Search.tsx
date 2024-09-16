/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/require-array-sort-compare */

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import Chip from '../components/Chip'
import IconEntry from '../components/IconEntry'

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
        <SearchInput
          hasTopMargin={false}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="icons"
          onKeyUp={e => {
            if (e.key === 'Enter' && searchQuery) {
              setCurrentIconSetProp({ search: searchQuery })
            }
          }}
          lighter
        />
        <Button
          onClick={() => {
            if (searchQuery) setCurrentIconSet({ search: searchQuery })
          }}
          icon="tabler:arrow-right"
          iconAtEnd
        >
          Search
        </Button>
      </div>
      {Object.keys(iconData.iconSets).length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.entries(iconData.iconSets)
            .sort()
            .map(([name, iconSet]) => (
              <Chip
                key={name}
                onClick={() => {
                  setCurrentIconSet(currentIconSet === name ? null : name)
                }}
                selected={currentIconSet === name}
                text={name}
              />
            ))}
        </div>
      )}
      <div className=" mt-6 grid min-h-0 grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 pb-8">
        {filteredIconList.map(icon => (
          <IconEntry
            key={icon}
            icon={icon.split(':').pop()}
            iconSet={icon.split(':').shift()}
            setSelectedIcon={setSelectedIcon}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex w-full justify-center pb-8">
      <Icon icon="svg-spinners:270-ring" className="size-8" />
    </div>
  )
}

export default Search
