import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Button from '@components/Button'

export default function Timer(): React.ReactElement {
  const [started, setStarted] = useState(false)

  return (
    <div className="flex-center flex min-h-0 w-full flex-1 flex-col gap-12">
      <div className="flex-center relative flex flex-col">
        <div
          className="radial-progress absolute text-bg-200 dark:text-bg-800"
          style={{
            // @ts-expect-error - Cannot fix lah this one ;-;
            '--value': '100',
            '--size': '28rem',
            '--thickness': '20px'
          }}
          role="progressbar"
        ></div>
        <div
          className="flex-center radial-progress flex text-custom-500"
          style={{
            // @ts-expect-error - Cannot fix lah this one ;-;
            '--value': '70',
            '--size': '28rem',
            '--thickness': '20px'
          }}
          role="progressbar"
        >
          <div className="z-[9999] mt-12 flex flex-col items-center gap-4 text-bg-800 dark:text-bg-100">
            <span className="text-7xl font-medium tracking-widest">02:33</span>
            <span className="text-lg font-medium uppercase tracking-widest text-custom-500">
              short break
            </span>
            {started ? (
              <span className="text-lg font-medium tracking-widest text-bg-100">
                #8
              </span>
            ) : (
              <button
                onClick={() => {
                  setStarted(true)
                }}
                className="rounded-lg p-4 text-bg-800 hover:bg-bg-50 dark:bg-bg-900 dark:text-bg-100"
              >
                <Icon icon="tabler:play" className="h-8 w-8 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
      {started && (
        <div className="flex items-center gap-6">
          <Button icon="tabler:pause">pause session</Button>
          <Button
            onClick={() => {
              setStarted(false)
            }}
            icon="tabler:square"
            type="secondary"
          >
            end session
          </Button>
        </div>
      )}
    </div>
  )
}
