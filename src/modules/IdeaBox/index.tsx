/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import CreateContainerModal from './components/CreateContainerModal'
import { Menu, Transition } from '@headlessui/react'
import DeleteContainerConfirmationModal from './components/DeleteContainerConfirmationModal'

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
  const [data, setData] = useState<IIdeaBoxContainer[] | 'error' | 'loading'>(
    'loading'
  )
  const [createContainerModalOpenType, setCreateContainerModalOpen] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteContainerConfirmationModalOpen,
    setDeleteContainerConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<IIdeaBoxContainer | null>(null)

  function updateContainerList(): void {
    setData('loading')
    fetch('http://localhost:3636/idea-box/container/list')
      .then(async response => {
        const data = await response.json()
        setData(data.data)

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
    updateContainerList()
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
        <>
          {(() => {
            switch (data) {
              case 'loading':
                return <Loading />
              case 'error':
                return <Error message="Failed to fetch data from server." />
              default:
                return data.length > 0 ? (
                  <div className="mt-6 grid w-full grid-cols-4 gap-6 overflow-y-auto pb-12">
                    {data.map((container, index) => (
                      <div
                        key={index}
                        className="relative flex flex-col items-center justify-start gap-6 rounded-lg bg-neutral-800/50 p-8 hover:bg-neutral-800/70"
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
                        <Link
                          to={`/idea-box/${container.id}`}
                          className="absolute left-0 top-0 h-full w-full"
                        />
                        <Menu
                          as="div"
                          className="absolute right-4 top-4 overscroll-contain"
                        >
                          <Menu.Button className="rounded-md p-2 text-neutral-500 hover:bg-neutral-700/30 hover:text-neutral-100">
                            <Icon
                              icon="tabler:dots-vertical"
                              className="h-5 w-5"
                            />
                          </Menu.Button>
                          <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            className="absolute right-0 top-3"
                          >
                            <Menu.Items className="mt-8 w-48 overflow-hidden rounded-md bg-neutral-800 shadow-lg outline-none focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      setExistedData(container)
                                      setCreateContainerModalOpen('update')
                                    }}
                                    className={`${
                                      active
                                        ? 'bg-neutral-700 text-neutral-100'
                                        : 'text-neutral-500'
                                    } flex w-full items-center p-4`}
                                  >
                                    <Icon
                                      icon="tabler:edit"
                                      className="h-5 w-5"
                                    />
                                    <span className="ml-2">Edit</span>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      setExistedData(container)
                                      setDeleteContainerConfirmationModalOpen(
                                        true
                                      )
                                    }}
                                    className={`${
                                      active
                                        ? 'bg-neutral-700 text-red-600'
                                        : 'text-red-500'
                                    } flex w-full items-center p-4`}
                                  >
                                    <Icon
                                      icon="tabler:trash"
                                      className="h-5 w-5"
                                    />
                                    <span className="ml-2">Delete</span>
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setCreateContainerModalOpen('create')
                      }}
                      className="relative flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-neutral-700 p-8 hover:bg-neutral-800/20"
                    >
                      <Icon
                        icon="tabler:cube-plus"
                        className="h-8 w-8 text-neutral-500"
                      />
                      <div className="text-xl font-semibold text-neutral-500">
                        Create container
                      </div>
                    </button>
                  </div>
                ) : (
                  <button className="flex h-full w-full flex-col items-center justify-center gap-6 text-neutral-500">
                    <Icon icon="tabler:cube-off" className="h-24 w-24" />
                    <h2 className="text-3xl font-semibold">
                      No idea containers
                    </h2>
                    <p className="-mt-2 text-xl">
                      Hmm, it seems a bit empty here. Consider creating one.
                    </p>
                    <button
                      onClick={() => {
                        setCreateContainerModalOpen('create')
                      }}
                      className="mt-6 flex items-center gap-2 rounded-full bg-teal-500 p-4 px-6 pr-7 font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:bg-teal-600"
                    >
                      <Icon icon="tabler:plus" className="text-xl" />
                      create one
                    </button>
                  </button>
                )
            }
          })()}
        </>
      </div>
      <CreateContainerModal
        openType={createContainerModalOpenType}
        setOpen={setCreateContainerModalOpen}
        updateContainerList={updateContainerList}
        existedData={existedData}
      />
      <DeleteContainerConfirmationModal
        isOpen={deleteContainerConfirmationModalOpen}
        closeModal={() => {
          setExistedData(null)
          setDeleteContainerConfirmationModalOpen(false)
        }}
        containerDetails={existedData}
        updateContainerList={updateContainerList}
      />
    </section>
  )
}

export default IdeaBox
