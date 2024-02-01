import { Icon } from '@iconify/react'
import React from 'react'

export default function WalletBalance(): React.JSX.Element {
  return (
    <section className="col-span-2 row-span-1 flex w-full flex-col gap-4 rounded-lg bg-neutral-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:wallet" className="text-2xl" />
        <span className="ml-2">Wallet Balance</span>
      </h1>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center justify-between gap-4 rounded-lg bg-neutral-100 p-4 pl-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/50">
          <div className="flex items-center gap-4">
            <Icon icon="tabler:cash" className="h-6 w-6" />
            <div className="flex flex-col">
              <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                Cash
              </div>
              <div className="text-sm text-neutral-500">RM 520.00</div>
            </div>
          </div>
          <button className="rounded-lg p-4 text-neutral-400 transition-all">
            <Icon icon="tabler:chevron-right" className="text-2xl" />
          </button>
        </li>
        <li className="flex items-center justify-between gap-4 rounded-lg bg-neutral-100 p-4 pl-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-neutral-200 dark:bg-neutral-800">
          <div className="flex items-center gap-4">
            <Icon icon="tabler:device-mobile" className="h-6 w-6" />
            <div className="flex flex-col">
              <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                Touch N&apos; Go e-Wallet
              </div>
              <div className="text-sm text-neutral-500">RM 128.00</div>
            </div>
          </div>
          <button className="rounded-lg p-4 text-neutral-400 transition-all">
            <Icon icon="tabler:chevron-right" className="text-2xl" />
          </button>
        </li>
        <li className="flex items-center justify-between gap-4 rounded-lg bg-neutral-100 p-4 pl-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-neutral-200 dark:bg-neutral-800">
          <div className="flex items-center gap-4">
            <Icon icon="tabler:building-bank" className="h-6 w-6" />
            <div className="flex flex-col">
              <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                Bank Account
              </div>
              <div className="text-sm text-neutral-500">RM 12,487.00</div>
            </div>
          </div>
          <button className="rounded-lg p-4 text-neutral-400 transition-all">
            <Icon icon="tabler:chevron-right" className="text-2xl" />
          </button>
        </li>
      </ul>
    </section>
  )
}
