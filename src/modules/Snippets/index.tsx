/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import { Icon } from '@iconify/react'
import Sidebar from './components/Sidebar'
import { toast } from 'react-toastify'
import Loading from '../../components/general/Loading'
import Error from '../../components/general/Error'
import { type ICodeSnippetsLabel } from './components/Sidebar/Labels'
import { type ICodeSnippetsLanguage } from './components/Sidebar/Languages'
import ViewSnippetModal from './components/ViewSnippetModal'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

export interface ICodeSnippetsEntry {
  collectionId: string
  collectionName: string
  created: string
  description: string
  id: string
  labels: string[]
  language: string
  title: string
  code?: string
  updated: string
}

function Snippets(): React.JSX.Element {
  const { id: viewSnippetId } = useParams<{ id: string }>()

  const [labels, setLabels] = useState<
    ICodeSnippetsLabel[] | 'error' | 'loading'
  >('loading')
  const [languages, setLanguages] = useState<
    ICodeSnippetsLanguage[] | 'error' | 'loading'
  >('loading')

  const [entries, setEntries] = useState<
    ICodeSnippetsEntry[] | 'error' | 'loading'
  >('loading')

  function updateLabelList(): void {
    fetch(`${import.meta.env.VITE_API_HOST}/code-snippets/label/list`)
      .then(async response => {
        const data = await response.json()

        if (response.status !== 200) {
          throw data.message
        }

        setLabels(data.data)
      })
      .catch(() => {
        toast.error('Failed to fetch data from server.')
      })
  }

  function updateLanguageList(): void {
    fetch(`${import.meta.env.VITE_API_HOST}/code-snippets/language/list`)
      .then(async response => {
        const data = await response.json()
        if (response.status !== 200) {
          throw data.message
        }

        setLanguages(data.data)
      })
      .catch(() => {
        toast.error('Failed to fetch data from server.')
      })
  }

  function updateSnippetList(): void {
    fetch(`${import.meta.env.VITE_API_HOST}/code-snippets/entry/list`)
      .then(async response => {
        const data = await response.json()

        if (response.status !== 200) {
          throw data.message
        }

        setEntries(data.data)
      })
      .catch(() => {
        toast.error('Failed to fetch data from server.')
        setEntries('error')
      })
  }

  useEffect(() => {
    updateLabelList()
    updateLanguageList()
    updateSnippetList()
  }, [])

  return (
    <>
      <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
        <ModuleHeader
          title="Code Snippets"
          desc="Programming is basically just putting together a bunch of code snippets."
        />
        <div className="my-8 flex min-h-0 w-full flex-1">
          <Sidebar
            labels={labels}
            languages={languages}
            updateLabelList={updateLabelList}
            updateLanguageList={updateLanguageList}
          />
          <div className="ml-8 flex h-full min-h-0 flex-1 flex-col">
            <div className="mx-4 flex items-center justify-between">
              <h1 className="text-4xl font-semibold text-neutral-800 dark:text-neutral-100">
                All Snippets{' '}
                <span className="text-base text-neutral-400">
                  ({Array.isArray(entries) ? entries.length : '0'})
                </span>
              </h1>
              <button className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:text-neutral-800">
                <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
                <span className="shrink-0">create</span>
              </button>
            </div>
            <search className="mx-4 mt-6 flex items-center gap-4 rounded-lg bg-neutral-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
              <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search snippets ..."
                className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              />
            </search>
            {(() => {
              switch (entries) {
                case 'loading':
                  return <Loading />
                case 'error':
                  return <Error message="Failed to fetch data from server." />
                default:
                  return (
                    <ul className="mt-6 flex min-h-0 flex-col overflow-y-auto">
                      {entries.map(entry => (
                        <li
                          key={entry.id}
                          className="relative m-4 mt-0 flex items-center justify-between gap-4 rounded-lg bg-neutral-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50"
                        >
                          <div className="flex w-full flex-col gap-1">
                            <div
                              className="-mt-1 mb-1 flex items-center gap-2 font-medium"
                              style={{
                                color: Array.isArray(languages)
                                  ? languages.filter(
                                      e => e.id === entry.language
                                    )[0].color
                                  : 'black'
                              }}
                            >
                              <Icon
                                icon={
                                  Array.isArray(languages)
                                    ? languages.filter(
                                        e => e.id === entry.language
                                      )[0].icon
                                    : 'tabler:code'
                                }
                                className="h-4 w-4"
                              />
                              <span>
                                {Array.isArray(languages)
                                  ? languages.filter(
                                      e => e.id === entry.language
                                    )[0].name
                                  : 'Unknown'}
                              </span>
                            </div>
                            <div className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                              {entry.title}
                            </div>
                            <p className="text-neutral-500">
                              {entry.description}
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                              {Array.isArray(labels) &&
                                entry.labels.map((label, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
                                    style={{
                                      backgroundColor:
                                        labels.filter(e => e.id === label)[0]
                                          .color + '20',
                                      color: labels.filter(
                                        e => e.id === label
                                      )[0].color
                                    }}
                                  >
                                    {labels.filter(e => e.id === label)[0].name}
                                  </div>
                                ))}
                            </div>
                          </div>
                          <Link
                            to={`/snippets/snippet/${entry.id}`}
                            className="absolute left-0 top-0 h-full w-full rounded-lg
                            hover:bg-[rgba(255,255,255,0.02)]"
                          />
                          <button className="absolute right-4 top-4 rounded-md p-2 text-neutral-500 hover:bg-neutral-700/30 hover:text-neutral-100">
                            <Icon
                              icon="tabler:dots-vertical"
                              className="h-5 w-5"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )
              }
            })()}
          </div>
        </div>
      </section>
      <ViewSnippetModal snippetId={viewSnippetId} />
    </>
  )
}

export default Snippets
