/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IProjectsKProgressStep } from '@typedec/ProjectK'
import { PROJECT_STATUS } from '..'
import APIRequest from '../../../../../utils/fetchData'

function CreateProjectModal({
  isOpen,
  setOpen,
  updateProjectsList
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  updateProjectsList: () => void
}): React.ReactElement {
  const [steps] = useFetch<IProjectsKProgressStep[]>(
    'projects-k/progress/list-steps'
  )
  const [loading, setLoading] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectVisibility, setProjectVisibility] = useState<
    'personal' | 'commercial'
  >('commercial')
  const [customerName, setCustomerName] = useState('')
  const [stepsToggled, setStepsToggled] = useState<string[]>([])
  const [projectStatus, setProjectStatus] = useState<
    'scheduled' | 'wip' | 'completed'
  >('scheduled')
  const [totalPayable, setTotalPayable] = useState(0)
  const [deposit, setDeposit] = useState(0)

  async function onSubmitButtonClick(): Promise<void> {
    if (projectName.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const project = {
      name: projectName.trim(),
      customerName: customerName.trim(),
      visibility: projectVisibility,
      status: projectStatus,
      totalPayable,
      deposit,
      steps: stepsToggled
    }

    await APIRequest({
      endpoint: 'projects-k/entry/create',
      method: 'POST',
      body: project,
      successInfo: 'Yay! Project created. Time to start working on it.',
      failureInfo: "Oops! Couldn't create the project. Please try again.",
      finalCallback: () => {
        setLoading(false)
      },
      callback: () => {
        setOpen(false)
        updateProjectsList()
      }
    })
  }

  function updateProjectName(e: React.ChangeEvent<HTMLInputElement>): void {
    setProjectName(e.target.value)
  }

  function updateCustomerName(e: React.ChangeEvent<HTMLInputElement>): void {
    setCustomerName(e.target.value)
  }

  function updateTotalPayable(e: React.ChangeEvent<HTMLInputElement>): void {
    setTotalPayable(Number(e.target.value) ?? 0)
  }

  function updateDeposit(e: React.ChangeEvent<HTMLInputElement>): void {
    setDeposit(Number(e.target.value) ?? 0)
  }

  function toggleStep(id: string): void {
    setStepsToggled(prev =>
      prev.includes(id) ? prev.filter(step => step !== id) : [...prev, id]
    )
  }

  return (
    <>
      <Modal isOpen={isOpen}>
        <ModalHeader
          title="Create project"
          icon="tabler:plus"
          onClose={() => {
            setOpen(false)
          }}
        />
        <div className="flex gap-4">
          {[
            ['Commercial', 'commercial', 'tabler:currency-dollar'],
            ['Personal', 'personal', 'tabler:currency-dollar-off']
          ].map(([text, value, icon]) => (
            <button
              key={value}
              onClick={() => {
                setProjectVisibility(value as 'commercial' | 'personal')
              }}
              className={`flex w-full items-center justify-center gap-2 rounded-md p-4 transition-colors ${
                projectVisibility === value ? 'bg-bg-200 dark:bg-bg-800' : ''
              }`}
            >
              <Icon icon={icon} className="h-6 w-6" />
              <p>{text}</p>
            </button>
          ))}
        </div>
        <Input
          name="Project name"
          value={projectName}
          updateValue={updateProjectName}
          placeholder="Project name"
          icon="tabler:clipboard"
          darker
          additionalClassName="min-w-[40vw] mt-6"
        />
        {projectVisibility === 'commercial' && (
          <>
            <Input
              name="Customer name"
              value={customerName}
              updateValue={updateCustomerName}
              placeholder="Customer name"
              icon="tabler:user"
              darker
              additionalClassName="mt-6"
            />
            <div className="mt-6 flex items-center gap-4">
              <Input
                name="Total payable"
                value={`${totalPayable}`}
                updateValue={updateTotalPayable}
                placeholder="Total payable"
                icon="tabler:currency-dollar"
                darker
                additionalClassName="w-[20vw]"
              />
              <Input
                name="Deposit"
                value={`${deposit}`}
                updateValue={updateDeposit}
                placeholder="Deposit"
                icon="tabler:currency-dollar"
                darker
                additionalClassName="w-[20vw]"
              />
            </div>
          </>
        )}
        <Listbox
          value={projectStatus}
          onChange={color => {
            setProjectStatus(color)
          }}
          as="div"
          className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:border-custom-500 dark:bg-bg-800/50"
        >
          <Listbox.Button className="flex w-full items-center">
            <Icon
              icon="tabler:info-circle"
              className={`ml-6 h-6 w-6 shrink-0 ${'text-bg-800 dark:text-bg-100'} group-focus-within:text-custom-500`}
            />
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
            >
              Project status
            </span>
            <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none sm:text-sm">
              <span
                className={`text-center font-semibold ${PROJECT_STATUS[projectStatus]?.color} h-2 w-2 rounded-md`}
              ></span>
              <span className="mt-[-1px] block truncate">
                {PROJECT_STATUS[projectStatus]?.name}
              </span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
              <Icon
                icon="tabler:chevron-down"
                className="h-5 w-5 text-bg-500"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute top-[4.5rem] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800 sm:text-sm">
              {Object.entries(PROJECT_STATUS).map(([id, { name, color }]) => (
                <Listbox.Option
                  key={id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active
                        ? 'bg-bg-200/50 dark:bg-bg-700/50'
                        : '!bg-transparent'
                    }`
                  }
                  value={id}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className="flex items-center gap-2">
                          <span
                            className={`mr-2 h-2 w-2 rounded-md text-center font-semibold ${color}`}
                          ></span>
                          {name}
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-bg-100"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
        <APIComponentWithFallback data={steps}>
          {typeof steps !== 'string' && (
            <>
              <div className="mt-6 flex items-center gap-2">
                <Icon
                  icon="tabler:chart-bar"
                  className="h-6 w-6 shrink-0 text-bg-800 group-focus-within:!text-custom-500 dark:text-bg-100"
                />
                <span className="pointer-events-none text-lg font-medium tracking-wide text-bg-100">
                  Progress steps
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-[20vw] w-full rounded-md bg-bg-800/50 p-4">
                  {steps
                    .filter(e => !stepsToggled.includes(e.id))
                    .map(step => (
                      <button
                        key={step.id}
                        onClick={() => {
                          toggleStep(step.id)
                        }}
                        className="flex w-full items-center gap-2 rounded-md p-4 hover:bg-bg-800"
                      >
                        <Icon icon={step.icon} className="h-5 w-5" />
                        {step.name}
                      </button>
                    ))}
                </div>
                <div className="flex h-full flex-col gap-4">
                  <Icon
                    icon="tabler:arrows-exchange"
                    className="text-2xl text-bg-500"
                  />
                </div>
                <div className="h-[20vw] w-full rounded-md bg-bg-800/50 p-4">
                  {stepsToggled.map(step => (
                    <button
                      key={step}
                      onClick={() => {
                        toggleStep(step)
                      }}
                      className="flex w-full items-center gap-2 rounded-md p-4 hover:bg-bg-800"
                    >
                      <Icon
                        icon={steps.find(s => s.id === step)!.icon}
                        className="h-5 w-5"
                      />
                      {steps.find(s => s.id === step)!.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </APIComponentWithFallback>
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(() => {})
          }}
          type="create"
        />
      </Modal>
    </>
  )
}

export default CreateProjectModal
