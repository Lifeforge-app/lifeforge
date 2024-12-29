import { Icon } from '@iconify/react/dist/iconify.js'
import { t } from 'i18next'
import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import Button from '@components/ButtonsAndInputs/Button'
import ListboxOrComboboxInput from '@components/ButtonsAndInputs/ListboxOrComboboxInput'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'

function Statements(): React.ReactElement {
  const { transactions, assets, categories } = useWalletContext()
  const [year, setYear] = useState<number | null>(null)
  const [month, setMonth] = useState<number | null>(null)
  const [showStatement, setShowStatement] = useState(false)
  const yearsOptions = useMemo(() => {
    if (typeof transactions === 'string') return []

    return Array.from(
      new Set(transactions.map(transaction => moment(transaction.date).year()))
    )
  }, [transactions])

  const monthsOptions = useMemo(() => {
    if (typeof transactions === 'string' || year === null) return []

    return Array.from(
      new Set(
        transactions
          .filter(transaction => moment(transaction.date).year() === year)
          .map(transaction => moment(transaction.date).month())
      )
    )
  }, [transactions, year])

  useEffect(() => {
    if (yearsOptions.length > 0) {
      setYear(yearsOptions[0])
    }
  }, [yearsOptions])

  useEffect(() => {
    if (monthsOptions.length > 0) {
      setMonth(monthsOptions[0])
    }
  }, [monthsOptions])

  const filteredTransactions = useMemo(() => {
    if (typeof transactions === 'string') return []

    return transactions.filter(
      transaction =>
        moment(transaction.date).month() === month &&
        moment(transaction.date).year() === year
    )
  }, [transactions, month, year])

  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  return (
    <ModuleWrapper>
      <ModuleHeader title="Financial Statements" icon="tabler:file-text" />
      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
        <ListboxOrComboboxInput
          type="listbox"
          name={t('input.month')}
          icon="tabler:calendar-month"
          value={month}
          setValue={setMonth}
          className="w-full sm:w-1/2"
          buttonContent={
            <>
              <span className="-mt-px block truncate">
                {month !== null ? moment().month(month).format('MMMM') : 'None'}
              </span>
            </>
          }
        >
          {monthsOptions.map(mon => (
            <ListboxOrComboboxOption
              key={mon}
              text={moment().month(mon).format('MMMM')}
              value={mon}
            />
          ))}
        </ListboxOrComboboxInput>
        <ListboxOrComboboxInput
          type="listbox"
          name={t('input.year')}
          icon="tabler:calendar"
          value={year}
          setValue={setYear}
          className="w-full sm:w-1/2"
          buttonContent={
            <>
              <span className="-mt-px block truncate">{year ?? 'None'}</span>
            </>
          }
        >
          {yearsOptions.map(yr => (
            <ListboxOrComboboxOption key={yr} text={yr.toString()} value={yr} />
          ))}
        </ListboxOrComboboxInput>
      </div>
      {year !== null && month !== null && (
        <>
          <Button
            className="mt-4"
            icon="tabler:printer"
            onClick={() => {
              reactToPrintFn()
            }}
          >
            Print
          </Button>
          <Button
            className="mt-2"
            onClick={() => {
              setShowStatement(!showStatement)
            }}
            icon="tabler:eye"
            variant="secondary"
          >
            {showStatement ? 'Hide' : 'Show'} Statement
          </Button>
          <div
            ref={contentRef}
            className={`print-area relative my-6 flex h-0 w-full flex-col overflow-hidden font-[Outfit] transition-all duration-500 [interpolate-size:allow-keywords] print:!w-[1200px] print:bg-white print:text-black ${
              !showStatement ? 'h-0 print:h-auto' : '!h-full duration-[1.5s]'
            }`}
          >
            <div className="size-full">
              <h1 className="mb-8 hidden items-center gap-2 text-4xl font-medium print:flex">
                <Icon
                  icon="tabler:hammer"
                  className="size-12 text-custom-500 print:text-lime-600"
                />
                Lifeforge
                <span className="text-custom-500 print:text-lime-600">.</span>
              </h1>
              <h1 className="hidden text-6xl font-bold uppercase leading-snug tracking-widest print:block">
                Personal
                <br />
                Financial Statements
              </h1>
              <p className="mt-4 hidden text-3xl text-bg-500 print:block">
                For the month ended{' '}
                <span className="font-bold text-bg-100">
                  {moment()
                    .month(month + 1)
                    .date(0)
                    .format('DD MMMM YYYY')}
                </span>
              </p>
              <h2 className="mt-16 text-3xl font-semibold uppercase tracking-widest">
                <span className="text-custom-500 print:text-lime-600">
                  01.{' '}
                </span>
                Overview
              </h2>
              <div className="mt-6 flex w-full flex-col">
                <div className="flex items-center justify-between p-3">
                  <p className="text-xl">Income</p>
                  <p className="text-lg">
                    RM{' '}
                    {numberToMoney(
                      filteredTransactions.reduce((acc, curr) => {
                        if (curr.type === 'income') return acc + curr.amount
                        return acc
                      }, 0)
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-bg-900 p-3 print:!bg-black/[3%]">
                  <p className="text-xl">Expenses</p>
                  <p className="text-lg">
                    RM{' '}
                    {numberToMoney(
                      filteredTransactions.reduce((acc, curr) => {
                        if (curr.type === 'expenses') return acc + curr.amount
                        return acc
                      }, 0)
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="p-3 text-xl font-semibold">
                    Net Income / (Loss)
                  </p>
                  {(() => {
                    const netIncome = filteredTransactions.reduce(
                      (acc, curr) => {
                        if (curr.type === 'income') return acc + curr.amount
                        if (curr.type === 'expenses') return acc - curr.amount
                        return acc
                      },
                      0
                    )

                    return (
                      <p
                        style={{
                          borderTop: '2px solid',
                          borderBottom: '6px double'
                        }}
                        className={`p-3 text-lg font-medium ${
                          netIncome < 0 && 'text-rose-600'
                        }`}
                      >
                        RM{' '}
                        {netIncome >= 0
                          ? numberToMoney(netIncome)
                          : `(${numberToMoney(Math.abs(netIncome))})`}
                      </p>
                    )
                  })()}
                </div>
              </div>
              <h2 className="mt-16 text-2xl font-semibold uppercase tracking-widest">
                <span>1.1 </span>
                Assets
              </h2>
              <APIComponentWithFallback data={assets}>
                {assets => (
                  <div className="overflow-x-auto">
                    <table className="mt-6 w-full">
                      <thead>
                        <tr className="bg-custom-500 text-white print:bg-lime-600">
                          <th className="w-full p-3 text-left text-lg font-medium">
                            Assets
                          </th>
                          <th className="whitespace-nowrap p-3 text-lg font-medium">
                            {moment()
                              .month(month - 1)
                              .format('MMM YYYY')}
                          </th>
                          <th className="whitespace-nowrap p-3 text-lg font-medium">
                            {moment().month(month).format('MMM YYYY')}
                          </th>
                          <th
                            className="whitespace-nowrap p-3 text-lg font-medium"
                            colSpan={2}
                          >
                            Change
                          </th>
                        </tr>
                        <tr className="bg-zinc-800 text-white print:bg-black/70">
                          <th className="w-full px-4 py-2 text-left text-lg font-medium"></th>
                          <th className="px-4 py-2 text-lg font-medium">RM</th>
                          <th className="px-4 py-2 text-lg font-medium">RM</th>
                          <th className="px-4 py-2 text-lg font-medium">RM</th>
                          <th className="px-4 py-2 text-lg font-medium">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(asset => (
                            <tr
                              key={asset.id}
                              className="even:bg-zinc-800/30 even:print:bg-black/[3%]"
                            >
                              <td className="p-3 text-lg">
                                <div className="flex items-center gap-2">
                                  <Icon
                                    icon={asset.icon}
                                    className="size-6 shrink-0"
                                  />
                                  <span className="whitespace-nowrap">
                                    {asset.name}
                                  </span>
                                </div>
                              </td>
                              {(() => {
                                if (typeof transactions === 'string') {
                                  return <></>
                                }
                                const balance = asset.balance

                                const transactionsForAsset =
                                  transactions.filter(
                                    transaction =>
                                      transaction.asset === asset.id
                                  )

                                const transactionsAfterMonth =
                                  transactionsForAsset.filter(
                                    transaction =>
                                      moment(transaction.date).month() >
                                        month &&
                                      moment(transaction.date).year() === year
                                  )

                                const transactionsThisMonth =
                                  transactionsForAsset.filter(
                                    transaction =>
                                      moment(transaction.date).month() ===
                                        month &&
                                      moment(transaction.date).year() === year
                                  )

                                const thatMonthAmount =
                                  balance -
                                  transactionsAfterMonth.reduce((acc, curr) => {
                                    if (curr.side === 'debit') {
                                      return acc + curr.amount
                                    }
                                    if (curr.side === 'credit') {
                                      return acc - curr.amount
                                    }
                                    return acc
                                  }, 0)

                                const lastMonthAmount =
                                  thatMonthAmount -
                                  transactionsThisMonth.reduce((acc, curr) => {
                                    if (curr.side === 'debit') {
                                      return acc + curr.amount
                                    }
                                    if (curr.side === 'credit') {
                                      return acc - curr.amount
                                    }
                                    return acc
                                  }, 0)

                                return (
                                  <>
                                    <td className="whitespace-nowrap p-3 text-right text-lg">
                                      {numberToMoney(lastMonthAmount)}
                                    </td>
                                    <td className="whitespace-nowrap p-3 text-right text-lg">
                                      {numberToMoney(thatMonthAmount)}
                                    </td>
                                    <td
                                      className={`whitespace-nowrap p-3 text-right text-lg ${
                                        thatMonthAmount - lastMonthAmount < 0 &&
                                        'text-rose-600'
                                      }`}
                                    >
                                      {thatMonthAmount - lastMonthAmount < 0
                                        ? `(${numberToMoney(
                                            Math.abs(
                                              thatMonthAmount - lastMonthAmount
                                            )
                                          )})`
                                        : numberToMoney(
                                            thatMonthAmount - lastMonthAmount
                                          )}
                                    </td>
                                    <td
                                      className={`whitespace-nowrap p-3 text-right text-lg ${
                                        thatMonthAmount - lastMonthAmount < 0 &&
                                        'text-rose-600'
                                      }`}
                                    >
                                      {lastMonthAmount === 0
                                        ? '-'
                                        : `${(
                                            ((thatMonthAmount -
                                              lastMonthAmount) /
                                              lastMonthAmount) *
                                            100
                                          ).toFixed(2)}%`}
                                    </td>
                                  </>
                                )
                              })()}
                            </tr>
                          ))}
                        <tr className="even:bg-zinc-800/30 even:print:bg-black/[3%]">
                          <td className="p-3 text-lg">
                            <div className="flex items-center gap-2 text-xl font-semibold">
                              <span>Total Assets</span>
                            </div>
                          </td>
                          {(() => {
                            if (typeof transactions === 'string') return <></>
                            const balance = assets.reduce(
                              (acc, curr) => acc + curr.balance,
                              0
                            )

                            const transactionsAfterMonth = transactions.filter(
                              transaction =>
                                moment(transaction.date).month() > month &&
                                moment(transaction.date).year() === year
                            )

                            const transactionsThisMonth = transactions.filter(
                              transaction =>
                                moment(transaction.date).month() === month &&
                                moment(transaction.date).year() === year
                            )

                            const thatMonthAmount =
                              balance -
                              transactionsAfterMonth.reduce((acc, curr) => {
                                if (curr.side === 'debit') {
                                  return acc + curr.amount
                                }
                                if (curr.side === 'credit') {
                                  return acc - curr.amount
                                }
                                return acc
                              }, 0)

                            const lastMonthAmount =
                              thatMonthAmount -
                              transactionsThisMonth.reduce((acc, curr) => {
                                if (curr.side === 'debit') {
                                  return acc + curr.amount
                                }
                                if (curr.side === 'credit') {
                                  return acc - curr.amount
                                }
                                return acc
                              }, 0)

                            return (
                              <>
                                <td
                                  style={{
                                    borderTop: '2px solid',
                                    borderBottom: '6px double'
                                  }}
                                  className="whitespace-nowrap p-3 text-right text-lg font-medium"
                                >
                                  {numberToMoney(lastMonthAmount)}
                                </td>
                                <td
                                  style={{
                                    borderTop: '2px solid',
                                    borderBottom: '6px double'
                                  }}
                                  className="whitespace-nowrap p-3 text-right text-lg font-medium"
                                >
                                  {numberToMoney(thatMonthAmount)}
                                </td>
                                <td
                                  style={{
                                    borderTop: '2px solid',
                                    borderBottom: '6px double'
                                  }}
                                  className={`whitespace-nowrap p-3 text-right text-lg font-medium ${
                                    thatMonthAmount - lastMonthAmount < 0 &&
                                    'text-rose-600'
                                  }`}
                                >
                                  {thatMonthAmount - lastMonthAmount < 0
                                    ? `(${numberToMoney(
                                        Math.abs(
                                          thatMonthAmount - lastMonthAmount
                                        )
                                      )})`
                                    : numberToMoney(
                                        thatMonthAmount - lastMonthAmount
                                      )}
                                </td>
                                <td
                                  style={{
                                    borderTop: '2px solid',
                                    borderBottom: '6px double'
                                  }}
                                  className={`whitespace-nowrap p-3 text-right text-lg font-medium ${
                                    thatMonthAmount - lastMonthAmount < 0 &&
                                    'text-rose-600'
                                  }`}
                                >
                                  {lastMonthAmount === 0
                                    ? '-'
                                    : `${(
                                        ((thatMonthAmount - lastMonthAmount) /
                                          lastMonthAmount) *
                                        100
                                      ).toFixed(2)}%`}
                                </td>
                              </>
                            )
                          })()}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </APIComponentWithFallback>
              {['income', 'expenses'].map(type => (
                <div key={type}>
                  <h2 className="mt-16 text-2xl font-semibold uppercase tracking-widest">
                    <span>1.{type === 'income' ? '2' : '3'} </span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </h2>
                  <APIComponentWithFallback data={categories}>
                    {categories => (
                      <div className="overflow-x-auto overflow-y-hidden">
                        <table className="mt-6 w-full">
                          <thead>
                            <tr className="bg-custom-500 text-white print:bg-lime-600">
                              <th className="w-full p-3 text-left text-lg font-medium">
                                Category
                              </th>
                              <th className="whitespace-nowrap p-3 text-lg font-medium">
                                {moment()
                                  .month(month - 1)
                                  .format('MMM YYYY')}
                              </th>
                              <th className="whitespace-nowrap p-3 text-lg font-medium">
                                {moment().month(month).format('MMM YYYY')}
                              </th>
                              <th
                                className="whitespace-nowrap p-3 text-lg font-medium"
                                colSpan={2}
                              >
                                Change
                              </th>
                            </tr>
                            <tr className="bg-zinc-800 text-white print:bg-black/70">
                              <th className="w-full px-4 py-2 text-left text-lg font-medium"></th>
                              <th className="px-4 py-2 text-lg font-medium">
                                RM
                              </th>
                              <th className="px-4 py-2 text-lg font-medium">
                                RM
                              </th>
                              <th className="px-4 py-2 text-lg font-medium">
                                RM
                              </th>
                              <th className="px-4 py-2 text-lg font-medium">
                                %
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories
                              .filter(category => category.type === type)
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map(category => (
                                <tr
                                  key={category.id}
                                  className="even:bg-zinc-800/30 even:print:bg-black/[3%]"
                                >
                                  <td className="p-3 text-lg">
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        icon={category.icon}
                                        className="size-6 shrink-0"
                                        style={{
                                          color: category.color
                                        }}
                                      />
                                      <span className="whitespace-nowrap">
                                        {category.name}
                                      </span>
                                    </div>
                                  </td>
                                  {(() => {
                                    if (typeof transactions === 'string') {
                                      return <></>
                                    }
                                    const lastMonthAmount = transactions
                                      .filter(
                                        transaction =>
                                          moment(transaction.date).month() ===
                                            month - 1 &&
                                          moment(transaction.date).year() ===
                                            year &&
                                          transaction.category === category.id
                                      )
                                      .reduce(
                                        (acc, curr) => acc + curr.amount,
                                        0
                                      )

                                    const thatMonthAmount = transactions
                                      .filter(
                                        transaction =>
                                          moment(transaction.date).month() ===
                                            month &&
                                          moment(transaction.date).year() ===
                                            year &&
                                          transaction.category === category.id
                                      )
                                      .reduce(
                                        (acc, curr) => acc + curr.amount,
                                        0
                                      )

                                    return (
                                      <>
                                        <td className="whitespace-nowrap p-3 text-right text-lg">
                                          {numberToMoney(lastMonthAmount)}
                                        </td>
                                        <td className="whitespace-nowrap p-3 text-right text-lg">
                                          {numberToMoney(thatMonthAmount)}
                                        </td>
                                        <td
                                          className={`whitespace-nowrap p-3 text-right text-lg ${
                                            (type === 'income'
                                              ? thatMonthAmount -
                                                lastMonthAmount
                                              : lastMonthAmount -
                                                thatMonthAmount) < 0 &&
                                            'text-rose-600'
                                          }`}
                                        >
                                          {thatMonthAmount - lastMonthAmount < 0
                                            ? `(${numberToMoney(
                                                Math.abs(
                                                  thatMonthAmount -
                                                    lastMonthAmount
                                                )
                                              )})`
                                            : numberToMoney(
                                                thatMonthAmount -
                                                  lastMonthAmount
                                              )}
                                        </td>
                                        <td
                                          className={`whitespace-nowrap p-3 text-right text-lg ${
                                            (type === 'income'
                                              ? thatMonthAmount -
                                                lastMonthAmount
                                              : lastMonthAmount -
                                                thatMonthAmount) < 0 &&
                                            'text-rose-600'
                                          }`}
                                        >
                                          {lastMonthAmount === 0
                                            ? '-'
                                            : `${(
                                                ((thatMonthAmount -
                                                  lastMonthAmount) /
                                                  lastMonthAmount) *
                                                100
                                              ).toFixed(2)}%`}
                                        </td>
                                      </>
                                    )
                                  })()}
                                </tr>
                              ))}
                            <tr className="even:bg-zinc-800/30 even:print:bg-black/[3%]">
                              <td className="p-3 text-lg">
                                <div className="flex items-center gap-2 text-xl font-semibold">
                                  <span>
                                    Total{' '}
                                    {type === 'income' ? 'Income' : 'Expenses'}
                                  </span>
                                </div>
                              </td>
                              {(() => {
                                if (typeof transactions === 'string') {
                                  return <></>
                                }
                                const lastMonthAmount = transactions
                                  .filter(
                                    transaction =>
                                      transaction.type === type &&
                                      moment(transaction.date).month() ===
                                        month - 1 &&
                                      moment(transaction.date).year() === year
                                  )
                                  .reduce((acc, curr) => acc + curr.amount, 0)

                                const thatMonthAmount = transactions
                                  .filter(
                                    transaction =>
                                      transaction.type === type &&
                                      moment(transaction.date).month() ===
                                        month &&
                                      moment(transaction.date).year() === year
                                  )
                                  .reduce((acc, curr) => acc + curr.amount, 0)

                                return (
                                  <>
                                    <td
                                      style={{
                                        borderTop: '2px solid',
                                        borderBottom: '6px double'
                                      }}
                                      className="whitespace-nowrap p-3 text-right text-lg font-medium"
                                    >
                                      {numberToMoney(lastMonthAmount)}
                                    </td>
                                    <td
                                      style={{
                                        borderTop: '2px solid',
                                        borderBottom: '6px double'
                                      }}
                                      className="whitespace-nowrap p-3 text-right text-lg font-medium"
                                    >
                                      {numberToMoney(thatMonthAmount)}
                                    </td>
                                    <td
                                      style={{
                                        borderTop: '2px solid',
                                        borderBottom: '6px double'
                                      }}
                                      className={`whitespace-nowrap p-3 text-right text-lg font-medium ${
                                        (type === 'income'
                                          ? thatMonthAmount - lastMonthAmount
                                          : lastMonthAmount - thatMonthAmount) <
                                          0 && 'text-rose-600'
                                      }`}
                                    >
                                      {thatMonthAmount - lastMonthAmount < 0
                                        ? `(${numberToMoney(
                                            Math.abs(
                                              thatMonthAmount - lastMonthAmount
                                            )
                                          )})`
                                        : numberToMoney(
                                            thatMonthAmount - lastMonthAmount
                                          )}
                                    </td>
                                    <td
                                      style={{
                                        borderTop: '2px solid',
                                        borderBottom: '6px double'
                                      }}
                                      className={`whitespace-nowrap p-3 text-right text-lg font-medium ${
                                        (type === 'income'
                                          ? thatMonthAmount - lastMonthAmount
                                          : lastMonthAmount - thatMonthAmount) <
                                          0 && 'text-rose-600'
                                      }`}
                                    >
                                      {lastMonthAmount === 0
                                        ? '-'
                                        : `${(
                                            ((thatMonthAmount -
                                              lastMonthAmount) /
                                              lastMonthAmount) *
                                            100
                                          ).toFixed(2)}%`}
                                    </td>
                                  </>
                                )
                              })()}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </APIComponentWithFallback>
                </div>
              ))}
              <h2 className="mt-16 text-3xl font-semibold uppercase tracking-widest">
                <span className="text-custom-500 print:text-lime-600">
                  02.{' '}
                </span>
                Transactions
              </h2>
              <APIComponentWithFallback data={transactions}>
                {transactions => (
                  <div className="mt-6 flex w-full flex-col">
                    <div className="flex items-center justify-between p-3">
                      <p className="text-xl">Income</p>
                      <p className="text-lg">
                        {
                          transactions.filter(
                            transaction =>
                              transaction.type === 'income' &&
                              moment(transaction.date).month() === month &&
                              moment(transaction.date).year() === year
                          ).length
                        }{' '}
                        entries
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-3 print:bg-black/[3%]">
                      <p className="text-xl">Expenses</p>
                      <p className="text-lg">
                        {
                          transactions.filter(
                            transaction =>
                              transaction.type === 'expenses' &&
                              moment(transaction.date).month() === month &&
                              moment(transaction.date).year() === year
                          ).length
                        }{' '}
                        entries
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-3">
                      <p className="text-xl">Transfer</p>
                      <p className="text-lg">
                        {
                          transactions.filter(
                            transaction =>
                              transaction.type === 'transfer' &&
                              moment(transaction.date).month() === month &&
                              moment(transaction.date).year() === year
                          ).length
                        }{' '}
                        entries
                      </p>
                    </div>
                    <div className="flex items-center justify-between print:bg-black/[3%]">
                      <p className="p-3 text-xl font-semibold">Total</p>
                      <p
                        className="p-3 text-lg font-medium"
                        style={{
                          borderTop: '2px solid',
                          borderBottom: '6px double'
                        }}
                      >
                        {
                          transactions.filter(
                            transaction =>
                              moment(transaction.date).month() === month &&
                              moment(transaction.date).year() === year
                          ).length
                        }{' '}
                        entries
                      </p>
                    </div>
                  </div>
                )}
              </APIComponentWithFallback>
              {['income', 'expenses', 'transfer'].map(type => (
                <div key={type}>
                  <h2 className="mt-16 text-2xl font-semibold uppercase tracking-widest">
                    <span>
                      2.
                      {type === 'income'
                        ? '1'
                        : type === 'expenses'
                        ? '2'
                        : '3'}{' '}
                    </span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </h2>
                  <APIComponentWithFallback data={transactions}>
                    {transactions => (
                      <div className="overflow-x-auto">
                        <table className="mt-6 w-full">
                          <thead>
                            <tr className="bg-custom-500 text-white print:bg-lime-600">
                              <th className="whitespace-nowrap p-3 text-lg font-medium">
                                Date
                              </th>
                              <th className="w-full p-3 text-left text-lg font-medium">
                                Particular
                              </th>
                              <th className="whitespace-nowrap p-3 text-lg font-medium">
                                Asset
                              </th>
                              {type !== 'transfer' && (
                                <th className="whitespace-nowrap p-3 text-lg font-medium">
                                  Category
                                </th>
                              )}
                              <th className="whitespace-nowrap p-3 text-lg font-medium">
                                Amount
                              </th>
                            </tr>
                            <tr className="bg-zinc-800 text-white print:bg-black/70">
                              <th className="whitespace-nowrap p-3 text-lg font-medium"></th>
                              <th className="w-full p-3 text-left text-lg font-medium"></th>
                              <th className="whitespace-nowrap p-3 text-lg font-medium"></th>
                              {type !== 'transfer' && (
                                <th className="whitespace-nowrap p-3 text-lg font-medium"></th>
                              )}
                              <th className="whitespace-nowrap p-3 text-lg font-medium">
                                RM
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions
                              .filter(
                                transaction =>
                                  transaction.type === type &&
                                  moment(transaction.date).month() === month &&
                                  moment(transaction.date).year() === year
                              )
                              .sort((a, b) => moment(a.date).diff(b.date))
                              .map((transaction, index) => (
                                <tr
                                  key={transaction.id}
                                  className="even:bg-zinc-800/30 even:print:bg-black/[3%]"
                                >
                                  <td className="whitespace-nowrap p-3 text-lg">
                                    {((type === 'transfer' &&
                                      index % 2 === 0) ||
                                      type !== 'transfer') &&
                                      moment(transaction.date).format('MMM DD')}
                                  </td>
                                  <td className="min-w-96 p-3 text-lg">
                                    {transaction.particulars}
                                  </td>

                                  <td className="whitespace-nowrap p-3 text-lg">
                                    {typeof assets !== 'string' && (
                                      <div className="flex items-center gap-2">
                                        <Icon
                                          icon={
                                            assets.find(
                                              asset =>
                                                asset.id === transaction.asset
                                            )?.icon ?? 'tabler:coin'
                                          }
                                          className="size-6 shrink-0"
                                        />
                                        <span>
                                          {
                                            assets.find(
                                              asset =>
                                                asset.id === transaction.asset
                                            )?.name
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </td>
                                  {type !== 'transfer' && (
                                    <td className="whitespace-nowrap p-3 text-lg">
                                      {typeof categories !== 'string' && (
                                        <div className="flex items-center gap-2">
                                          <Icon
                                            icon={
                                              categories.find(
                                                category =>
                                                  category.id ===
                                                  transaction.category
                                              )?.icon ?? 'tabler:coin'
                                            }
                                            className="size-6 shrink-0"
                                            style={{
                                              color: categories.find(
                                                category =>
                                                  category.id ===
                                                  transaction.category
                                              )?.color
                                            }}
                                          />
                                          <span>
                                            {
                                              categories.find(
                                                category =>
                                                  category.id ===
                                                  transaction.category
                                              )?.name
                                            }
                                          </span>
                                        </div>
                                      )}
                                    </td>
                                  )}
                                  <td className="whitespace-nowrap p-3 text-right text-lg">
                                    {transaction.side === 'credit'
                                      ? `(${numberToMoney(transaction.amount)})`
                                      : numberToMoney(transaction.amount)}
                                  </td>
                                </tr>
                              ))}
                            <tr className="even:bg-zinc-800/30 even:print:bg-black/[3%]">
                              <td
                                colSpan={type !== 'transfer' ? 4 : 3}
                                className="whitespace-nowrap p-3 text-left text-xl font-semibold"
                              >
                                Total{' '}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </td>
                              <td
                                className="whitespace-nowrap p-3 text-right text-lg font-medium"
                                style={{
                                  borderTop: '2px solid',
                                  borderBottom: '6px double'
                                }}
                              >
                                {(() => {
                                  const amount = transactions
                                    .filter(
                                      transaction =>
                                        transaction.type === type &&
                                        moment(transaction.date).month() ===
                                          month &&
                                        moment(transaction.date).year() === year
                                    )
                                    .reduce((acc, curr) => {
                                      if (curr.type !== 'transfer') {
                                        if (curr.side === 'debit') {
                                          return acc + curr.amount
                                        }
                                        if (curr.side === 'credit') {
                                          return acc - curr.amount
                                        }
                                      } else {
                                        return acc + curr.amount / 2
                                      }
                                      return acc
                                    }, 0)

                                  return (
                                    <span className="font-medium">
                                      {amount < 0
                                        ? `(${numberToMoney(Math.abs(amount))})`
                                        : numberToMoney(amount)}
                                    </span>
                                  )
                                })()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </APIComponentWithFallback>
                </div>
              ))}
              <div className="my-12 flex items-center gap-4">
                <div className="h-[3px] w-full bg-zinc-800 print:bg-black/70" />
                <div className="whitespace-nowrap text-xl font-semibold uppercase tracking-widest">
                  End of Financial Statements
                </div>
                <div className="h-[3px] w-full bg-zinc-800 print:bg-black/70" />
              </div>
            </div>
          </div>
        </>
      )}
    </ModuleWrapper>
  )
}

export default Statements
