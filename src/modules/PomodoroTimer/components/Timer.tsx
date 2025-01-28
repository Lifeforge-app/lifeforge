import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Button } from '@components/buttons'

export default function Timer(): React.ReactElement {
  // TODO: Implement UI to change time distribution
  const [timeDistribution] = useState([1500, 300, 900])
  const [currentRoundBig, setCurrentRoundBig] = useState(1)
  const [currentRoundSmall, setCurrentRoundSmall] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeDistribution[currentSection])
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (isRunning) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1)
        }, 1000)

        return () => {
          clearTimeout(timer)
        }
      }
      setCurrentRoundSmall(currentRoundSmall + 1)
      switch (currentSection) {
        case 0: {
          setCurrentSection(1)
          setTimeLeft(timeDistribution[1])

          if ((currentRoundSmall + 1) % 9 === 0) {
            setCurrentSection(2)
            setTimeLeft(timeDistribution[2])
          }
          break
        }
        case 1: {
          setCurrentSection(0)
          setTimeLeft(timeDistribution[0])
          setCurrentRoundBig(currentRoundBig + 1)
          break
        }
        case 2: {
          if (currentRoundSmall % 9 === 0) {
            setCurrentRoundSmall(0)
          }
          setCurrentSection(0)
          setTimeLeft(timeDistribution[0])
          break
        }
        default:
          break
      }
    }
    return () => {}
  }, [timeLeft, isRunning, currentSection])

  return (
    <div className="flex-center min-h-0 w-full flex-1 flex-col gap-12">
      <div className="flex-center relative flex-col">
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
          className="flex-center radial-progress text-custom-500"
          style={{
            // @ts-expect-error - Cannot fix lah this one ;-;
            '--value': `${(timeLeft / timeDistribution[currentSection]) * 100}`,
            '--size': '28rem',
            '--thickness': '20px'
          }}
          role="progressbar"
        >
          <div className="z-9999 mt-12 flex flex-col items-center gap-4 text-bg-800 dark:text-bg-50 ">
            <span className="text-7xl font-medium tracking-widest">
              {moment.utc(timeLeft * 1000).format('mm:ss')}
            </span>
            <span className="text-lg font-medium uppercase tracking-widest text-custom-500">
              {['Pomodoro', 'Short break', 'Long break'][currentSection]}
            </span>
            {isRunning ? (
              <span className="text-lg font-medium tracking-widest text-bg-50">
                #{currentRoundBig}
              </span>
            ) : (
              <button
                onClick={() => {
                  setIsRunning(true)
                }}
                className="rounded-lg p-4 text-bg-800 hover:bg-bg-50 dark:bg-bg-900 dark:text-bg-50"
              >
                <Icon icon="tabler:play" className="size-8 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
      {isRunning && (
        <div className="flex items-center gap-6">
          <Button onClick={() => {}} icon="tabler:pause">
            pause session
          </Button>
          <Button
            onClick={() => {
              setIsRunning(false)
            }}
            icon="tabler:square"
            variant="secondary"
          >
            end session
          </Button>
        </div>
      )}
    </div>
  )
}
