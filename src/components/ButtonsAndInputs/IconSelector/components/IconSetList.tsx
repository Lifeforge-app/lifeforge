/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
import { collections } from '@iconify/collections'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Input from './Input'

const ICON_SETS = {
  General: [],
  'Animated Icons': [],
  'Brands / Social': [],
  Emoji: [],
  'Maps / Flags': [],
  Thematic: [],
  'Archive / Unmaintained': [],
  Other: []
}

Object.entries(collections).forEach(([key, value]) => {
  value.prefix = key
  ICON_SETS[value.category || 'Other'] = [
    ...ICON_SETS[value.category || 'Other'],
    value
  ]
})

const ICON_COUNT = Object.values(ICON_SETS)
  .flat()
  .map(e => e.total)
  .reduce((a, b) => a + b)

export default function IconSetList({
  setCurrentIconSet
}: {
  setCurrentIconSet: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    }>
  >
}): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [iconFilterTerm, setIconFilterTerm] = useState('')

  return (
    <div className="overflow-scroll p-8 pb-2 pt-0">
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Input
          value={searchQuery}
          setValue={setSearchQuery}
          placeholder={`Search ${ICON_COUNT.toLocaleString()} icons`}
          icon="uil:search"
        />
        <button
          type="button"
          onClick={() => {
            if (searchQuery) setCurrentIconSet({ search: searchQuery })
          }}
          className="flex-center flex gap-1 rounded-md bg-bg-200 px-6 py-4 font-medium text-bg-800 shadow-md transition-all hover:bg-[#b3bdc9]"
        >
          Search
          <Icon icon="uil:arrow-right" className="h-5 w-5 text-bg-800" />
        </button>
      </div>
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row">
        <div className="mt-4 flex w-full flex-wrap gap-2">
          {Object.keys(ICON_SETS).map((category, index) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSelectedCategory(selectedCategory === index ? null : index)
              }}
              className={`${
                selectedCategory === index
                  ? 'bg-bg-200 text-bg-800 shadow-md'
                  : ''
              } flex-center flex h-8 grow whitespace-nowrap rounded-full bg-bg-800 px-6 text-sm text-bg-100 shadow-md transition-all md:grow-0`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="w-full lg:w-3/5 xl:w-1/3">
          <Input
            value={iconFilterTerm}
            setValue={setIconFilterTerm}
            placeholder="Filter icon sets"
            icon="uil:filter"
          />
        </div>
      </div>
      <div className="mt-12 flex min-h-0 w-full flex-col items-center overflow-scroll">
        <div className="flex w-full flex-col">
          {Object.entries(ICON_SETS).map(
            ([category, iconSets], index) =>
              Boolean(
                (selectedCategory === null || selectedCategory === index) &&
                  iconSets.filter(
                    iconSet =>
                      !iconFilterTerm.trim() ||
                      iconSet.name
                        .toLowerCase()
                        .includes(iconFilterTerm.trim().toLowerCase())
                  ).length
              ) && (
                <div key={category} className="mb-6 w-full overflow-hidden">
                  <div className="relative mb-8 rounded-lg text-center text-2xl font-medium after:absolute after:-bottom-2 after:left-1/2 after:w-8 after:-translate-x-1/2 after:border-b-2 after:border-b-bg-200">
                    {category}
                  </div>
                  <div className="icon-list grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] flex-wrap gap-4">
                    {iconSets.map(
                      iconSet =>
                        (!iconFilterTerm.trim() ||
                          iconSet.name
                            .toLowerCase()
                            .includes(iconFilterTerm.trim().toLowerCase())) && (
                          <button
                            key={iconSet.prefix}
                            type="button"
                            onClick={() => {
                              setCurrentIconSet({ iconSet: iconSet.prefix })
                            }}
                            className="sssm:flex-row flex w-full grow flex-col overflow-hidden rounded-md bg-bg-800 shadow-lg"
                          >
                            <div className="sssm:w-36 text-bg-00 flex w-full shrink-0 flex-col font-medium">
                              <div className="sssm:gap-3 flex-center flex h-full w-full gap-5 px-4 py-6 ">
                                {iconSet.samples.map(sampleIcon => (
                                  <Icon
                                    key={sampleIcon}
                                    icon={`${iconSet.prefix}:${sampleIcon}`}
                                    className="h-8 w-8 shrink-0"
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex w-full flex-col justify-between px-4 pb-3 text-left">
                              <h3 className="truncate text-xl font-semibold">
                                {iconSet.name}
                              </h3>
                              <p className="mt-1 truncate text-sm">
                                By&nbsp;
                                <span className="underline">
                                  {iconSet.author.name}
                                </span>
                              </p>
                              <div className="sssm:py-0 mt-4 flex w-full items-center justify-between border-t border-bg-500 pt-4 text-sm">
                                <p>{iconSet.total} icons</p>
                                {iconSet.height && (
                                  <div className="flex items-center">
                                    <Icon
                                      icon="icon-park-outline:auto-height-one"
                                      width="20"
                                      height="20"
                                    />
                                    <p className="ml-1">{iconSet.height}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                    )}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  )
}
