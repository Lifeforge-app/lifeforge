/* eslint-disable @typescript-eslint/no-misused-promises */
import { Icon } from '@iconify/react/dist/iconify.js'
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
import type IGuitarTabsEntry from '@interfaces/guitar_tabs_interfaces'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import IntervalManager from '@utils/intervalManager'
import { toCamelCase } from '@utils/strings'
import EntryItem from './components/EntryItem'

const intervalManager = IntervalManager.getInstance()

function GuitarTabs(): React.ReactElement {
  const [page, setPage] = useState<number>(1)
  const [entries, refreshEntries] = useFetch<{
    totalItems: number
    totalPages: number
    page: number
    items: IGuitarTabsEntry[]
  }>(`/guitar-tabs/list?page=${page}`)
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

  const renderPageNumbers = ({
    currentPage,
    totalPages,
    handlePageChange
  }: {
    currentPage: number
    totalPages: number
    handlePageChange: (page: number) => void
  }): React.ReactElement[] => {
    const pageNumbers: JSX.Element[] = []
    const pagesToShow = 5

    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1)

    if (startPage > 1) {
      if (startPage > 2) {
        pageNumbers.push(
          <>
            <button
              key={1}
              onClick={() => {
                handlePageChange(1)
              }}
              className={`rounded-md px-3 py-2  ${
                currentPage === 1
                  ? 'font-semibold text-custom-500'
                  : 'text-bg-500 hover:bg-bg-800'
              }`}
            >
              {1}
            </button>
            <Icon icon="uil:ellipsis-h" className="text-bg-500" />
          </>
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => {
            handlePageChange(i)
          }}
          className={`rounded-md px-5 py-3  ${
            currentPage === i
              ? 'font-semibold text-custom-500'
              : 'text-bg-500 hover:bg-bg-800'
          }`}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <>
          {endPage < totalPages && (
            <Icon icon="uil:ellipsis-h" className="text-bg-500" />
          )}
          <button
            key={totalPages}
            onClick={() => {
              handlePageChange(totalPages)
            }}
            className={`rounded-md px-5 py-3  ${
              currentPage === totalPages
                ? 'font-semibold text-custom-500'
                : 'text-bg-500 hover:bg-bg-800'
            }`}
          >
            {totalPages}
          </button>
        </>
      )
    }

    return pageNumbers
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
          <>
            <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {entries.items.map(entry => (
                <EntryItem key={entry.id} entry={entry} />
              ))}
            </div>
            {
              <div className="mt-4 flex items-center justify-between gap-2 pb-12">
                {entries.page > 1 ? (
                  <Button
                    onClick={() => {
                      if (entries.page > 1) {
                        setPage(entries.page - 1)
                      }
                    }}
                    icon="uil:angle-left"
                    variant="no-bg"
                  >
                    Previous
                  </Button>
                ) : (
                  <span className="w-32"></span>
                )}
                <div className="flex items-center gap-2">
                  {renderPageNumbers({
                    currentPage: entries.page,
                    totalPages: entries.totalPages,
                    handlePageChange: setPage
                  })}
                </div>
                {entries.page < entries.totalPages ? (
                  <Button
                    onClick={() => {
                      if (entries.page < entries.totalPages) {
                        setPage(entries.page + 1)
                      }
                    }}
                    icon="uil:angle-right"
                    variant="no-bg"
                    iconAtEnd
                  >
                    Next
                  </Button>
                ) : (
                  <span className="w-32"></span>
                )}
              </div>
            }
          </>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default GuitarTabs
