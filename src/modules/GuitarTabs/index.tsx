/* eslint-disable @typescript-eslint/no-misused-promises */
import { cookieParse } from 'pocketbase'
import React, { useMemo, useRef, useState } from 'react'
import { type Id, toast } from 'react-toastify'
import colors from 'tailwindcss/colors'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import type BasePBCollection from '@interfaces/pocketbase_interfaces'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import IntervalManager from '@utils/intervalManager'
import { toCamelCase } from '@utils/strings'

const intervalManager = IntervalManager.getInstance()

interface IGuitarTabsEntry extends BasePBCollection {
  name: string
  file: string
  thumbnail: string
  pageCount: number
}

function GuitarTabs(): React.ReactElement {
  const [entries, refreshEntries] =
    useFetch<IGuitarTabsEntry[]>('/guitar-tabs/list')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const toastId = useRef<Id>(null)
  const { themeColor } = usePersonalizationContext()
  const finalTheme = useMemo(() => {
    return colors[
      toCamelCase(
        themeColor.replace('theme-', '').replace(/-/g, ' ').replace('deep', '')
      ) as keyof typeof colors
    ][500]
  }, [themeColor])

  async function checkUploadStatus(): Promise<{
    status: 'completed' | 'failed' | 'in_progress'
    left: number
    total: number
  }> {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/guitar-tabs/process-status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return data.data
    }
    return {
      status: 'failed',
      left: 0,
      total: 0
    }
  }

  function updateProgressBar(progress: number): void {
    if (toastId.current === null) {
      toastId.current = toast('Upload in Progress', {
        progress,
        autoClose: false
      })
    } else {
      setTimeout(() => {
        if (toastId.current !== null) {
          toast.update(toastId.current, {
            progress,
            progressStyle: {
              background: finalTheme
            }
          })
        }
      }, 0)
    }
  }

  async function uploadFiles(): Promise<void> {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf'
    input.onchange = async e => {
      const files = (e.target as HTMLInputElement).files

      const formData = new FormData()
      if (files !== null) {
        if (files.length > 25) {
          toast.error('You can only upload 25 files at a time!')
          return
        }

        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i], encodeURIComponent(files[i].name))
        }

        fetch(`${import.meta.env.VITE_API_HOST}/guitar-tabs/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          },
          body: formData
        })
          .then(async res => {
            if (res.status === 202) {
              const data = await res.json()
              if (data.state === 'accepted') {
                intervalManager.setInterval(async () => {
                  const { status, left, total } = await checkUploadStatus()
                  console.log(left)
                  switch (status) {
                    case 'completed':
                      if (toastId.current !== null) {
                        toast.done(toastId.current)
                        toastId.current = null
                        toast.success('Guitar tabs uploaded successfully!')
                        intervalManager.clearAllIntervals()
                        refreshEntries()
                      }
                      break
                    case 'in_progress':
                      updateProgressBar((total - left) / total)
                      break
                    case 'failed':
                      toast.error('Failed to upload guitar tabs!')
                      intervalManager.clearAllIntervals()
                      break
                  }
                }, 1000)
              }
            } else {
              const data = await res.json()
              throw new Error(
                `Failed to upload guitar tabs. Error: ${data.message}`
              )
            }
          })
          .catch(err => {
            toast.error(`Oops! Couldn't upload the guitar tabs! Error: ${err}`)
          })
      }
    }
    input.click()
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Guitar Tabs"
        desc="..."
        actionButton={
          <Button
            onClick={() => {
              uploadFiles().catch(console.error)
            }}
            icon="tabler:upload"
          >
            Upload
          </Button>
        }
      />
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="guitar tabs"
      />
      <APIComponentWithFallback data={entries}>
        {typeof entries !== 'string' && (
          <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {entries.map(entry => (
              <div
                key={entry.id}
                className="rounded-lg bg-bg-50 p-4 shadow-custom hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/70"
              >
                <img
                  src={`${import.meta.env.VITE_API_HOST}/media/${
                    entry.collectionId
                  }/${entry.id}/${entry.thumbnail}?thumb=500x0`}
                  alt={entry.name}
                  className="h-96 w-full rounded-md bg-bg-800 object-contain object-top"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    {entry.name.replace(/\.pdf$/, '')}
                  </h3>
                  <p className="text-sm text-bg-500">{entry.pageCount} pages</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default GuitarTabs
