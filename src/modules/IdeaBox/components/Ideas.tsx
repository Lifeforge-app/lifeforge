/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { Link, useParams } from 'react-router-dom'
// @ts-expect-error - no types available
import Column from 'react-columns'
import { faker } from '@faker-js/faker'
import { toast } from 'react-toastify'
import Loading from '../../../components/Loading'
import Error from '../../../components/Error'
import { type IIdeaBoxContainer } from '..'
import EmptyStateScreen from './EmptyStateScreen'
import { Menu, Transition } from '@headlessui/react'
import CreateIdeaModal from './ModifyIdeaModal'
import Zoom from 'react-medium-image-zoom'

export interface IIdeaBoxEntry {
  collectionId: string
  collectionName: string
  container: string
  content: string
  created: string
  id: string
  image: string
  title: string
  type: 'text' | 'image' | 'link'
  updated: string
}

const CustomZoomContent = ({
  img
}: {
  buttonUnzoom: React.ReactElement
  modalState: 'LOADING' | 'LOADED' | 'UNLOADING' | 'UNLOADED'
  img: any
}): React.ReactElement => {
  return <>{img}</>
}

function Ideas(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState<IIdeaBoxEntry[] | 'error' | 'loading'>(
    'loading'
  )
  const [containerDetails, setContainerDetails] = useState<
    IIdeaBoxContainer | 'loading' | 'error'
  >('loading')
  const [modifyIdeaModalOpenType, setModifyIdeaModalOpenType] = useState<
    null | 'create' | 'update'
  >(null)
  const [typeOfModifyIdea, setTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')

  function fetchContainerDetails(): void {
    setContainerDetails('loading')
    fetch(`http://localhost:3636/idea-box/container/get/${id}`)
      .then(async response => {
        const data = await response.json()
        setContainerDetails(data.data)

        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        setContainerDetails('error')
        toast.error('Failed to fetch data from server.')
      })
  }

  function updateIdeaList(): void {
    setData('loading')
    fetch(`http://localhost:3636/idea-box/idea/list/${id}`)
      .then(async response => {
        const data = await response.json()
        setData(data.data.reverse())

        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        setData('error')
        toast.error('Failed to fetch data from server.')
      })
  }

  useEffect(() => {
    fetchContainerDetails()
    updateIdeaList()
  }, [])

  return (
    <>
      <section className="relative min-h-0 w-full min-w-0 flex-1 overflow-y-auto px-12">
        <div className="flex flex-col gap-1">
          <Link
            to="/idea-box"
            className="mb-2 flex w-min items-center gap-2 rounded-lg p-2 pl-0 pr-4 text-neutral-500 hover:text-neutral-100"
          >
            <Icon icon="tabler:chevron-left" className="text-xl" />
            <span className="whitespace-nowrap text-lg font-medium">
              Go back
            </span>
          </Link>
          <div className="flex items-center justify-between">
            <h1
              className={`flex items-center gap-4 ${
                typeof containerDetails !== 'string' ? 'text-3xl' : 'text-2xl'
              } font-semibold `}
            >
              {(() => {
                switch (containerDetails) {
                  case 'loading':
                    return (
                      <>
                        <span className="small-loader-light"></span>
                        Loading...
                      </>
                    )
                  case 'error':
                    return (
                      <>
                        <Icon
                          icon="tabler:alert-triangle"
                          className="mt-0.5 h-7 w-7 text-red-500"
                        />
                        Failed to fetch data from server.
                      </>
                    )
                  default:
                    return (
                      <>
                        <div
                          className="rounded-lg p-3"
                          style={{
                            backgroundColor: containerDetails.color + '20'
                          }}
                        >
                          <Icon
                            icon={containerDetails.icon}
                            className="text-3xl"
                            style={{
                              color: containerDetails.color
                            }}
                          />
                        </div>
                        {containerDetails.name}
                      </>
                    )
                }
              })()}
            </h1>

            <div className="flex items-center gap-4">
              <search className="flex w-96 items-center gap-4 rounded-lg bg-neutral-800/50 p-4">
                <Icon
                  icon="tabler:search"
                  className="h-5 w-5 text-neutral-500"
                />
                <input
                  type="text"
                  placeholder="Search ideas ..."
                  className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
                />
              </search>
              <button className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-800 hover:text-neutral-100">
                <Icon icon="tabler:dots-vertical" className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
        {(() => {
          switch (data) {
            case 'loading':
              return <Loading />
            case 'error':
              return <Error message="Failed to fetch data from server." />
            default:
              return data.length > 0 ? (
                <Column columns={4} gap="0.5rem" className="mt-8 h-max">
                  {data.map(entry => {
                    switch (entry.type) {
                      case 'image':
                        return (
                          <div className="group relative">
                            <Zoom
                              zoomMargin={40}
                              ZoomContent={CustomZoomContent}
                            >
                              <img
                                src={`http://127.0.0.1:8090/api/files/${entry.collectionId}/${entry.id}/${entry.image}`}
                                alt={''}
                                className="my-4 rounded-lg"
                              />
                            </Zoom>
                            <Menu as="div" className="absolute right-2 top-2">
                              <Menu.Button>
                                {({ open }) => (
                                  <div
                                    className={`shrink-0 rounded-lg bg-neutral-800/50 p-2 text-neutral-100 opacity-0 hover:bg-neutral-900 hover:text-neutral-100 group-hover:opacity-100 ${
                                      open && '!bg-neutral-900 !opacity-100'
                                    }`}
                                  >
                                    <Icon
                                      icon="tabler:dots-vertical"
                                      className="text-xl"
                                    />
                                  </div>
                                )}
                              </Menu.Button>
                              <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                                className="absolute right-0 top-3"
                              >
                                <Menu.Items className="mt-8 w-48 overflow-hidden rounded-md bg-neutral-800 shadow-lg outline-none focus:outline-none">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => {
                                          setTypeOfModifyIdea('image')
                                          setModifyIdeaModalOpenType('update')
                                        }}
                                        className={`${
                                          active
                                            ? 'bg-neutral-700/50 text-neutral-100'
                                            : 'text-neutral-500'
                                        } group flex w-full items-center gap-4 rounded-md p-4`}
                                      >
                                        <Icon
                                          icon="tabler:pencil"
                                          className={`${
                                            active
                                              ? 'text-neutral-100'
                                              : 'text-neutral-500'
                                          } h-5 w-5`}
                                        />
                                        Edit
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active
                                            ? 'bg-neutral-700/50 text-red-600'
                                            : ' text-red-500'
                                        } group flex w-full items-center gap-4 rounded-md p-4`}
                                      >
                                        <Icon
                                          icon="tabler:trash"
                                          className="h-5 w-5"
                                        />
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        )
                      case 'text':
                        return (
                          <div className="group my-4 flex items-start justify-between gap-2 rounded-lg bg-neutral-800/50 p-4">
                            <p className="mt-1.5 text-neutral-300">
                              {entry.content}
                            </p>
                            <Menu as="div" className="relative">
                              <Menu.Button>
                                {({ open }) => (
                                  <div
                                    className={`shrink-0 rounded-lg p-2 text-neutral-100 opacity-0 hover:bg-neutral-800 hover:text-neutral-100 group-hover:opacity-100 ${
                                      open && '!bg-neutral-800 !opacity-100'
                                    }`}
                                  >
                                    <Icon
                                      icon="tabler:dots-vertical"
                                      className="text-xl"
                                    />
                                  </div>
                                )}
                              </Menu.Button>
                              <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                                className="absolute right-0 top-3"
                              >
                                <Menu.Items className="mt-8 w-48 overflow-hidden rounded-md bg-neutral-800 shadow-lg outline-none focus:outline-none">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => {
                                          setTypeOfModifyIdea('text')
                                          setModifyIdeaModalOpenType('update')
                                        }}
                                        className={`${
                                          active
                                            ? 'bg-neutral-700/50 text-neutral-100'
                                            : 'text-neutral-500'
                                        } group flex w-full items-center gap-4 rounded-md p-4`}
                                      >
                                        <Icon
                                          icon="tabler:pencil"
                                          className={`${
                                            active
                                              ? 'text-neutral-100'
                                              : 'text-neutral-500'
                                          } h-5 w-5`}
                                        />
                                        Edit
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active
                                            ? 'bg-neutral-700/50 text-red-600'
                                            : ' text-red-500'
                                        } group flex w-full items-center gap-4 rounded-md p-4`}
                                      >
                                        <Icon
                                          icon="tabler:trash"
                                          className="h-5 w-5"
                                        />
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        )
                      case 'link':
                        return (
                          <div className="my-4 flex flex-col gap-2 rounded-lg bg-neutral-800/50 p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-xl font-semibold ">
                                {entry.title}
                              </h3>
                              <Menu as="div" className="relative">
                                <Menu.Button>
                                  {({ open }) => (
                                    <div
                                      className={`shrink-0 rounded-lg p-2 text-neutral-100 opacity-0 hover:bg-neutral-800 hover:text-neutral-100 group-hover:opacity-100 ${
                                        open && '!bg-neutral-800 !opacity-100'
                                      }`}
                                    >
                                      <Icon
                                        icon="tabler:dots-vertical"
                                        className="text-xl"
                                      />
                                    </div>
                                  )}
                                </Menu.Button>
                                <Transition
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                  className="absolute right-0 top-3"
                                >
                                  <Menu.Items className="mt-8 w-48 overflow-hidden rounded-md bg-neutral-800 shadow-lg outline-none focus:outline-none">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            setTypeOfModifyIdea('link')
                                            setModifyIdeaModalOpenType('update')
                                          }}
                                          className={`${
                                            active
                                              ? 'bg-neutral-700/50 text-neutral-100'
                                              : 'text-neutral-500'
                                          } group flex w-full items-center gap-4 rounded-md p-4`}
                                        >
                                          <Icon
                                            icon="tabler:pencil"
                                            className={`${
                                              active
                                                ? 'text-neutral-100'
                                                : 'text-neutral-500'
                                            } h-5 w-5`}
                                          />
                                          Edit
                                        </button>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          className={`${
                                            active
                                              ? 'bg-neutral-700/50 text-red-600'
                                              : ' text-red-500'
                                          } group flex w-full items-center gap-4 rounded-md p-4`}
                                        >
                                          <Icon
                                            icon="tabler:trash"
                                            className="h-5 w-5"
                                          />
                                          Delete
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </div>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={entry.content}
                              className="text-teal-500 underline underline-offset-2"
                            >
                              {entry.content}
                            </a>
                          </div>
                        )
                      default:
                        return (
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between gap-2">
                              <h3 className="text-xl font-semibold ">
                                {faker.lorem.sentence()}
                              </h3>
                              <button className="shrink-0 rounded-lg p-2 hover:bg-neutral-700/50">
                                <Icon
                                  icon="tabler:dots-vertical"
                                  className="text-xl"
                                />
                              </button>
                            </div>
                            <p className="text-neutral-300">
                              {faker.lorem.paragraph()}
                            </p>
                          </div>
                        )
                    }
                  })}
                </Column>
              ) : (
                <EmptyStateScreen
                  setModifyModalOpenType={setModifyIdeaModalOpenType}
                  title="No ideas yet"
                  description="Hmm... Seems a bit empty here. Consider adding some innovative ideas."
                  icon="tabler:bulb-off"
                  ctaContent="new idea"
                />
              )
          }
        })()}
        <Menu
          as="div"
          className="group fixed bottom-12 right-12 overscroll-contain "
        >
          <Menu.Button className="flex items-center gap-2 rounded-lg bg-teal-500 p-4 font-semibold uppercase tracking-wider text-neutral-800 shadow-lg hover:bg-teal-600">
            {({ open }) => (
              <Icon
                icon="tabler:plus"
                className={`h-6 w-6 shrink-0 transition-all ${
                  open && 'rotate-45'
                }`}
              />
            )}
          </Menu.Button>
          <Transition
            enter="transition-all ease-out duration-300 overflow-hidden"
            enterFrom="max-h-0"
            enterTo="max-h-96"
            leave="transition-all ease-in duration-200 overflow-hidden"
            leaveFrom="max-h-96"
            leaveTo="max-h-0"
            className="absolute bottom-0 right-0 -translate-y-16 overflow-hidden"
          >
            <Menu.Items className="mt-2 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="py-1">
                {[
                  ['Text', 'tabler:text-size'],
                  ['Link', 'tabler:link'],
                  ['Image', 'tabler:photo']
                ].map(([name, icon]) => (
                  <Menu.Item key={name}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          setTypeOfModifyIdea(
                            name.toLowerCase() as 'text' | 'image' | 'link'
                          )
                          setModifyIdeaModalOpenType('create')
                        }}
                        className={`group flex w-full items-center justify-end gap-4 rounded-md py-3 pr-2 ${
                          active ? 'text-neutral-200' : 'text-neutral-500'
                        }`}
                      >
                        {name}
                        <button
                          className={`rounded-full ${
                            active ? 'bg-neutral-400' : 'bg-neutral-200'
                          } p-3`}
                        >
                          <Icon
                            icon={icon}
                            className={`h-5 w-5 text-neutral-800 ${
                              active && 'text-neutral-300'
                            }`}
                          />
                        </button>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </section>
      <CreateIdeaModal
        openType={modifyIdeaModalOpenType}
        typeOfModifyIdea={typeOfModifyIdea}
        setOpenType={setModifyIdeaModalOpenType}
        containerId={id as string}
        setData={setData}
      />
    </>
  )
}

export default Ideas
