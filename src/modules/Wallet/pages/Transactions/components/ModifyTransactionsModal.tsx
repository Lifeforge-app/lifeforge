/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import CurrencyInputComponent from '@components/ButtonsAndInputs/CurrencyInput'
import DateInput from '@components/ButtonsAndInputs/DateInput'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import useFetch from '@hooks/useFetch'
import {
  type IWalletAssetEntry,
  type IWalletLedgerEntry,
  type IWalletCategoryEntry,
  type IWalletTransactionEntry
} from '@typedec/Wallet'
import APIRequest from '@utils/fetchData'

const TRANSACTION_TYPES = [
  { name: 'Income', color: '#10B981', id: 'income', icon: 'tabler:login-2' },
  { name: 'Expenses', color: '#EF4444', id: 'expenses', icon: 'tabler:logout' },
  {
    name: 'Transfer',
    color: '#3B82F6',
    id: 'transfer',
    icon: 'tabler:transfer'
  }
]

function ModifyTransactionsModal({
  openType,
  setOpenType,
  existedData,
  setExistedData,
  refreshTransactions
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWalletTransactionEntry | null
  setExistedData: React.Dispatch<
    React.SetStateAction<IWalletTransactionEntry | null>
  >
  refreshTransactions: () => void
}): React.ReactElement {
  const [particular, setParticular] = useState('')
  const [transactionType, setTransactionType] = useState<
    'income' | 'expenses' | 'transfer'
  >('income')
  const [categories] = useFetch<IWalletCategoryEntry[]>(
    'wallet/category/list',
    openType !== null
  )
  const [assets] = useFetch<IWalletAssetEntry[]>('wallet/assets/list')
  const [ledgers] = useFetch<IWalletLedgerEntry[]>('wallet/ledgers/list')
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [amount, setAmount] = useState<string>()
  const [category, setCategory] = useState<string | null>(null)
  const [transactionAsset, setTransactionAsset] = useState<string | null>(null)
  const [ledger, setLedger] = useState<string | null>(null)
  const [fromAsset, setFromAsset] = useState<string | null>(null)
  const [toAsset, setToAsset] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<File | null>(null)
  const [toRemoveReceipt, setToRemoveReceipt] = useState<boolean>(false)

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setParticular(existedData.particulars)
          setTransactionType(existedData.type)
          setTransactionDate(existedData.date)
          setAmount(existedData.amount.toString())
          setCategory(existedData.category)
          setTransactionAsset(existedData.asset)
          setLedger(existedData.ledger)
          setReceipt(null)
          setImagePreviewUrl(
            existedData.receipt
              ? `${import.meta.env.VITE_API_HOST}/media/${
                  existedData.collectionId
                }/${existedData.id}/${existedData.receipt}`
              : ''
          )
        }
      } else {
        setParticular('')
        setTransactionType('income')
        setTransactionDate(new Date().toISOString().split('T')[0])
        setAmount(undefined)
        setCategory(null)
        setTransactionAsset(null)
        setLedger(null)
        setFromAsset(null)
        setToAsset(null)
        setReceipt(null)
        setImagePreviewUrl(null)
      }
    }
  }, [openType, existedData])

  useEffect(() => {
    setCategory(null)
  }, [transactionType])

  function updateTransactionName(e: React.ChangeEvent<HTMLInputElement>): void {
    setParticular(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (transactionType === 'transfer') {
      if (!fromAsset || !toAsset) {
        toast.error('Please fill in the from and to assets.')
        return
      }
    } else {
      if (particular.trim().length === 0 || !transactionDate || !amount) {
        toast.error('Please fill in the particulars, date, and amount.')
        return
      }
    }

    const data = new FormData()
    data.append('particulars', particular)
    data.append('date', moment(transactionDate).format('YYYY-MM-DD'))
    data.append('amount', parseFloat(amount ?? '0').toString())
    data.append('category', category ?? '')
    data.append('asset', transactionAsset ?? '')
    data.append('ledger', ledger ?? '')
    data.append('type', transactionType)
    data.append('side', transactionType === 'income' ? 'debit' : 'credit')
    data.append('fromAsset', fromAsset ?? '')
    data.append('toAsset', toAsset ?? '')

    if (openType === 'update' && toRemoveReceipt) {
      data.append('removeReceipt', 'true')
    }

    if (receipt) data.append('file', receipt)

    setLoading(true)
    await APIRequest({
      endpoint: `wallet/transactions/${openType}${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: data,
      isJSON: false,
      successInfo: {
        create: 'Yay! Transaction created.',
        update: 'Yay! Transaction updated.'
      }[openType as 'create' | 'update'],
      failureInfo: {
        create: "Oops! Couldn't create the transaction. Please try again.",
        update: "Oops! Couldn't update the transaction. Please try again."
      }[openType as 'create' | 'update'],
      callback: () => {
        refreshTransactions()
        setExistedData(null)
        setOpenType(null)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  function uploadReceipt(): void {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async e => {
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(input.files[0])
        setReceipt(input.files[0])
      }
    }

    input.click()
  }

  return (
    <>
      <Modal isOpen={openType !== null} minWidth="40vw">
        <ModalHeader
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          title={openType === 'create' ? 'Add Transaction' : 'Edit Transaction'}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Listbox
          disabled={openType === 'update'}
          value={transactionType}
          onChange={color => {
            setTransactionType(color ?? '')
          }}
          as="div"
          className="group relative mb-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
        >
          <Listbox.Button className="flex w-full items-center">
            <Icon
              icon="tabler:list"
              className={`ml-6 size-6 shrink-0 ${
                transactionType !== null ? '' : 'text-bg-500'
              } group-focus-within:!text-custom-500`}
            />
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
            >
              Transaction type {openType === 'update' && '(Unchangable)'}
            </span>
            <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
              <Icon
                icon={
                  TRANSACTION_TYPES.find(l => l.id === transactionType)?.icon ??
                  ''
                }
                style={{
                  color: TRANSACTION_TYPES.find(l => l.id === transactionType)
                    ?.color
                }}
                className="size-5"
              />
              <span className="-mt-px block truncate">
                {TRANSACTION_TYPES.find(l => l.id === transactionType)?.name ??
                  'None'}
              </span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
              <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
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
            <Listbox.Options className="absolute top-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
              {TRANSACTION_TYPES.map(({ name, color, id }, i) => (
                <Listbox.Option
                  key={i}
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
                          <Icon
                            icon={
                              TRANSACTION_TYPES.find(l => l.id === id)?.icon ??
                              ''
                            }
                            style={{ color }}
                            className="size-5"
                          />
                          {name}
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
        {typeof assets !== 'string' &&
          (transactionType === 'income' || transactionType === 'expenses' ? (
            <Listbox
              value={transactionAsset}
              onChange={setTransactionAsset}
              as="div"
              className="group relative mb-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
            >
              <Listbox.Button className="flex w-full items-center">
                <Icon
                  icon="tabler:wallet"
                  className={`ml-6 size-6 shrink-0 ${
                    transactionAsset !== null ? '' : 'text-bg-500'
                  } group-focus-within:!text-custom-500`}
                />
                <span
                  className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
                >
                  Asset
                </span>
                <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
                  <Icon
                    icon={
                      assets.find(l => l.id === transactionAsset)?.icon ??
                      'tabler:wallet-off'
                    }
                    className="size-5"
                  />
                  <span className="-mt-px block truncate">
                    {assets.find(l => l.id === transactionAsset)?.name ??
                      'None'}
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
                  <Icon
                    icon="tabler:chevron-down"
                    className="size-5 text-bg-500"
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
                <Listbox.Options className="absolute top-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
                  <Listbox.Option
                    key={'none'}
                    className={({ active }) =>
                      `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                        active
                          ? 'bg-bg-200/50 dark:bg-bg-700/50'
                          : '!bg-transparent'
                      }`
                    }
                    value={null}
                  >
                    {({ selected }) => (
                      <>
                        <div>
                          <span className="flex items-center gap-2">
                            <Icon icon="tabler:wallet-off" className="size-5" />
                            None
                          </span>
                        </div>
                        {selected && (
                          <Icon
                            icon="tabler:check"
                            className="block text-lg text-custom-500"
                          />
                        )}
                      </>
                    )}
                  </Listbox.Option>
                  {assets.map(({ name, id, icon }, i) => (
                    <Listbox.Option
                      key={i}
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
                              <Icon icon={icon} className="size-5" />
                              {name}
                            </span>
                          </div>
                          {selected && (
                            <Icon
                              icon="tabler:check"
                              className="block text-lg text-custom-500"
                            />
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          ) : (
            <>
              <Listbox
                value={fromAsset}
                onChange={setFromAsset}
                as="div"
                className="group relative mb-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
              >
                <Listbox.Button className="flex w-full items-center">
                  <Icon
                    icon="tabler:step-out"
                    className={`ml-6 size-6 shrink-0 ${
                      fromAsset !== null ? '' : 'text-bg-500'
                    } group-focus-within:!text-custom-500`}
                  />
                  <span
                    className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
                  >
                    From Asset
                  </span>
                  <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
                    <Icon
                      icon={
                        assets.find(l => l.id === fromAsset)?.icon ??
                        'tabler:wallet-off'
                      }
                      className="size-5"
                    />
                    <span className="-mt-px block truncate">
                      {assets.find(l => l.id === fromAsset)?.name ?? 'None'}
                    </span>
                  </div>
                  <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
                    <Icon
                      icon="tabler:chevron-down"
                      className="size-5 text-bg-500"
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
                  <Listbox.Options className="absolute top-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
                    {assets.map(({ name, id, icon }, i) => (
                      <Listbox.Option
                        key={i}
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
                                <Icon icon={icon} className="size-5" />
                                {name}
                              </span>
                            </div>
                            {selected && (
                              <Icon
                                icon="tabler:check"
                                className="block text-lg text-custom-500"
                              />
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
              <Listbox
                value={toAsset}
                onChange={setToAsset}
                as="div"
                className="group relative mb-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
              >
                <Listbox.Button className="flex w-full items-center">
                  <Icon
                    icon="tabler:step-into"
                    className={`ml-6 size-6 shrink-0 ${
                      toAsset !== null ? '' : 'text-bg-500'
                    } group-focus-within:!text-custom-500`}
                  />
                  <span
                    className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
                  >
                    To Asset
                  </span>
                  <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
                    <Icon
                      icon={
                        assets.find(l => l.id === toAsset)?.icon ??
                        'tabler:wallet-off'
                      }
                      className="size-5"
                    />
                    <span className="-mt-px block truncate">
                      {assets.find(l => l.id === toAsset)?.name ?? 'None'}
                    </span>
                  </div>
                  <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
                    <Icon
                      icon="tabler:chevron-down"
                      className="size-5 text-bg-500"
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
                  <Listbox.Options className="absolute top-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
                    {assets.map(({ name, id, icon }, i) => (
                      <Listbox.Option
                        key={i}
                        className={({ active }) =>
                          `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                            active
                              ? 'bg-bg-500/30 dark:bg-bg-700/50'
                              : '!bg-transparent'
                          }`
                        }
                        value={id}
                      >
                        {({ selected }) => (
                          <>
                            <div>
                              <span className="flex items-center gap-2">
                                <Icon icon={icon} className="size-5" />
                                {name}
                              </span>
                            </div>
                            {selected && (
                              <Icon
                                icon="tabler:check"
                                className="block text-lg text-custom-500"
                              />
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </>
          ))}
        {transactionType !== 'transfer' && (
          <Input
            icon="tabler:file-text"
            placeholder="My Transactions"
            value={particular}
            darker
            name="Particulars"
            updateValue={updateTransactionName}
          />
        )}
        <DateInput
          name="Date"
          date={transactionDate}
          setDate={setTransactionDate}
          icon="tabler:calendar"
        />
        <CurrencyInputComponent
          icon="tabler:currency-dollar"
          name="Amount"
          value={amount}
          updateValue={setAmount}
          placeholder="0.00"
          darker
          additionalClassName="mt-4"
        />
        {typeof categories !== 'string' && transactionType !== 'transfer' && (
          <Listbox
            value={category}
            onChange={setCategory}
            as="div"
            className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
          >
            <Listbox.Button className="flex w-full items-center">
              <Icon
                icon="tabler:apps"
                className={`ml-6 size-6 shrink-0 ${
                  category !== null ? '' : 'text-bg-500'
                } group-focus-within:!text-custom-500`}
              />
              <span
                className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
              >
                Category
              </span>
              <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
                <Icon
                  icon={
                    categories.find(l => l.id === category)?.icon ??
                    'tabler:apps-off'
                  }
                  style={{
                    color: categories.find(l => l.id === category)?.color
                  }}
                  className="size-5"
                />
                <span className="-mt-px block truncate">
                  {categories.find(l => l.id === category)?.name ?? 'None'}
                </span>
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
                <Icon
                  icon="tabler:chevron-down"
                  className="size-5 text-bg-500"
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
              <Listbox.Options className="absolute bottom-[120%] z-[100] mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
                <Listbox.Option
                  key={'none'}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active
                        ? 'bg-bg-200/50 dark:bg-bg-700/50'
                        : '!bg-transparent'
                    }`
                  }
                  value={null}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className="flex items-center gap-2 font-medium">
                          <span
                            className="rounded-md p-2"
                            style={{ backgroundColor: '#FFFFFF20' }}
                          >
                            <Icon
                              icon="tabler:apps-off"
                              className="size-5"
                              style={{ color: 'white' }}
                            />
                          </span>
                          None
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
                {categories
                  .filter(e => e.type === transactionType)
                  .map(({ name, color, id, icon }, i) => (
                    <Listbox.Option
                      key={i}
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
                            <span className="flex items-center gap-2 font-medium">
                              <span
                                className="rounded-md p-2"
                                style={{ backgroundColor: color + '20' }}
                              >
                                <Icon
                                  icon={icon}
                                  className="size-5"
                                  style={{ color }}
                                />
                              </span>
                              {name}
                            </span>
                          </div>
                          {selected && (
                            <Icon
                              icon="tabler:check"
                              className="block text-lg text-custom-500"
                            />
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        )}
        {typeof ledgers !== 'string' && transactionType !== 'transfer' && (
          <Listbox
            value={ledger}
            onChange={setLedger}
            as="div"
            className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
          >
            <Listbox.Button className="flex w-full items-center">
              <Icon
                icon="tabler:book"
                className={`ml-6 size-6 shrink-0 ${
                  ledger !== '' && ledger !== null ? '' : 'text-bg-500'
                } group-focus-within:!text-custom-500`}
              />
              <span
                className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
              >
                Ledger
              </span>
              <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
                <Icon
                  icon={
                    ledgers.find(l => l.id === ledger)?.icon ?? 'tabler:book'
                  }
                  style={{
                    color: ledgers.find(l => l.id === ledger)?.color
                  }}
                  className="size-5"
                />
                <span className="-mt-px block truncate">
                  {ledgers.find(l => l.id === ledger)?.name ?? 'None'}
                </span>
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
                <Icon
                  icon="tabler:chevron-down"
                  className="size-5 text-bg-500"
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
              <Listbox.Options className="absolute bottom-[120%] z-[100] mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
                <Listbox.Option
                  key={'none'}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active
                        ? 'bg-bg-200/50 dark:bg-bg-700/50'
                        : '!bg-transparent'
                    }`
                  }
                  value={null}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className="flex items-center gap-2 font-medium">
                          <span
                            className="rounded-md p-2"
                            style={{ backgroundColor: '#FFFFFF20' }}
                          >
                            <Icon
                              icon="tabler:book"
                              className="size-5"
                              style={{ color: 'white' }}
                            />
                          </span>
                          None
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
                {ledgers.map(({ name, color, id, icon }, i) => (
                  <Listbox.Option
                    key={i}
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
                          <span className="flex items-center gap-2 font-medium">
                            <span
                              className="rounded-md p-2"
                              style={{ backgroundColor: color + '20' }}
                            >
                              <Icon
                                icon={icon}
                                className="size-5"
                                style={{ color }}
                              />
                            </span>
                            {name}
                          </span>
                        </div>
                        {selected && (
                          <Icon
                            icon="tabler:check"
                            className="block text-lg text-custom-500"
                          />
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        )}
        <div className="mt-4 w-full rounded-md bg-bg-800/50 p-6">
          <div className="flex items-center gap-4 text-bg-500">
            <Icon icon="tabler:file-text" className="size-6" />
            <span className="font-medium">Receipt</span>
          </div>
          {imagePreviewUrl && (
            <Zoom zoomMargin={100}>
              <img
                src={imagePreviewUrl}
                alt=""
                className="mx-auto mt-6 max-h-64 rounded-md"
              />
            </Zoom>
          )}
          {imagePreviewUrl ? (
            <Button
              onClick={() => {
                setImagePreviewUrl(null)
                setReceipt(null)
                if (openType === 'update') setToRemoveReceipt(true)
              }}
              className="mt-6 w-full"
              isRed
              icon="tabler:x"
            >
              Remove Receipt
            </Button>
          ) : (
            <Button
              onClick={uploadReceipt}
              className="mt-6 w-full"
              icon="tabler:upload"
              type="secondary"
            >
              Upload Receipt
            </Button>
          )}
        </div>
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={openType === 'update' ? 'update' : 'create'}
        />
      </Modal>
    </>
  )
}

export default ModifyTransactionsModal
