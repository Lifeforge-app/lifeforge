import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react'
import { faker } from '@faker-js/faker'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export interface IIdeaBoxContainer {
  collectionId: string
  collectionName: string
  color: string
  created: string
  icon: string
  id: string
  image_count: number
  link_count: number
  name: string
  text_count: number
  updated: string
}

function IdeaBox(): React.JSX.Element {
  const [data, setData] = useState<IIdeaBoxContainer[]>([])
  const [icons, setIcons] = useState([])

  useEffect(() => {
    fetch('http://api.iconify.design/collection?prefix=tabler')
      .then(async response => await response.json())
      .then(data => {
        setIcons(data.uncategorized)
      })
      .catch(() => {})

    fetch('http://localhost:3636/idea-box/container/list')
      .then(async response => {
        const data = await response.json()
        setData(data)
      })
      .catch(() => {
        toast.error('Failed to fetch data from server.')
      })
  }, [])

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Idea Box"
        desc="Sometimes you will randomly stumble upon a great idea."
      />
      <div className="mt-8 flex min-h-0 w-full flex-1 flex-col">
        <search className="flex w-full items-center gap-4 rounded-lg bg-neutral-800/50 p-4">
          <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search idea containers ..."
            className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
        </search>
        <div className="mt-6 grid w-full grid-cols-4 gap-6 overflow-y-auto pb-12">
          {data.map((container, index) => (
            <Link
              to={`/idea-box/${container.id}`}
              key={index}
              className="relative flex flex-col items-center justify-start gap-6 rounded-lg bg-neutral-800/50 p-8 hover:bg-neutral-800"
            >
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: container.color + '20'
                }}
              >
                <Icon
                  icon={container.icon}
                  className="h-8 w-8"
                  style={{
                    color: container.color
                  }}
                />
              </div>
              <div className="text-center text-2xl font-medium text-neutral-50">
                {container.name}
              </div>
              <div className="mt-auto flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="tabler:article"
                    className="h-5 w-5 text-neutral-500"
                  />
                  <span className="text-neutral-500">
                    {container.text_count}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="tabler:link"
                    className="h-5 w-5 text-neutral-500"
                  />
                  <span className="text-neutral-500">
                    {container.link_count}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="tabler:photo"
                    className="h-5 w-5 text-neutral-500"
                  />
                  <span className="text-neutral-500">
                    {container.image_count}
                  </span>
                </div>
              </div>
              <button className="absolute right-4 top-4 rounded-md p-2 text-neutral-500 hover:bg-neutral-700/30 hover:text-neutral-100">
                <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
              </button>
            </Link>
          ))}
          <div className="relative flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-neutral-700 p-8">
            <Icon
              icon="tabler:cube-plus"
              className="h-8 w-8 text-neutral-500"
            />
            <div className="text-xl font-semibold text-neutral-500">
              Create container
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IdeaBox
