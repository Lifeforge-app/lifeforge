import { useCallback, useEffect, useMemo, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { ModuleHeader } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import {
  type BoardItem,
  type BoardLane,
  type BoardResponse,
  type Column,
  normalizeBoard
} from './board-model'
import './index.css'

const columns: Column[] = ['todo', 'doing', 'done']

function BoardCard({
  item,
  onDragStart,
  onPromote,
  promoting
}: {
  item: BoardItem
  onDragStart: (item: BoardItem) => void
  onPromote: (taskId: string) => void
  promoting: boolean
}) {
  const { t } = useModuleTranslation()

  const sourceLabel =
    item.source === 'personal'
      ? t('board.sources.personal')
      : t('board.sources.mission')

  return (
    <article
      draggable
      className="group rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      onDragStart={() => onDragStart(item)}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5 text-zinc-900">
          {item.title}
        </h3>
        <span aria-hidden="true" className="text-zinc-400">
          ⠿
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
          {sourceLabel}
        </span>
        {item.priority && (
          <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
            {item.priority}
          </span>
        )}
        {item.repo && (
          <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            {item.repo}
          </span>
        )}
        {item.kind && (
          <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500">
            {item.kind}
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] text-zinc-400">{item.id}</p>
      {item.source === 'personal' && item.squadMissionId ? (
        <p className="mt-2 text-[11px] text-emerald-700">
          {t('board.linkedMission')}: {item.squadMissionId}
        </p>
      ) : item.source === 'personal' ? (
        <button
          className="mt-3 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-60"
          disabled={promoting}
          type="button"
          onClick={() => onPromote(item.id)}
        >
          {promoting
            ? t('board.actions.promoting')
            : t('board.actions.promote')}
        </button>
      ) : null}
    </article>
  )
}

function BoardColumn({
  lane,
  column,
  items,
  onDrop,
  onDragStart,
  onPromote,
  promotingId
}: {
  lane: 'personal' | 'work'
  column: Column
  items: BoardItem[]
  onDrop: (lane: 'personal' | 'work', column: Column) => void
  onDragStart: (item: BoardItem) => void
  onPromote: (taskId: string) => void
  promotingId: string | null
}) {
  const { t } = useModuleTranslation()

  return (
    <section
      className="flex min-h-80 min-w-72 flex-1 flex-col rounded-xl bg-zinc-100/80 p-3"
      onDragOver={event => event.preventDefault()}
      onDrop={() => onDrop(lane, column)}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
          {t(`board.columns.${column}`)}
        </h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-zinc-500 shadow-sm">
          {items.length}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-2">
        {items.map(item => (
          <BoardCard
            key={`${item.source}-${item.id}`}
            item={item}
            promoting={promotingId === item.id}
            onDragStart={onDragStart}
            onPromote={onPromote}
          />
        ))}
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-400">
            {t('board.empty')}
          </p>
        )}
      </div>
    </section>
  )
}

function Lane({
  lane,
  items,
  onDrop,
  onDragStart,
  onPromote,
  promotingId
}: {
  lane: 'personal' | 'work'
  items: BoardItem[]
  onDrop: (lane: 'personal' | 'work', column: Column) => void
  onDragStart: (item: BoardItem) => void
  onPromote: (taskId: string) => void
  promotingId: string | null
}) {
  const { t } = useModuleTranslation()

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-zinc-900">
          {t(`board.lanes.${lane}`)}
        </h2>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map(column => (
          <BoardColumn
            key={column}
            column={column}
            items={items.filter(item => item.status === column)}
            lane={lane}
            promotingId={promotingId}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onPromote={onPromote}
          />
        ))}
      </div>
    </section>
  )
}

export default function UnifiedKanban() {
  const { t } = useModuleTranslation()
  const [board, setBoard] = useState<BoardLane>({ personal: [], work: [] })
  const [dragged, setDragged] = useState<BoardItem | null>(null)
  const [promotingId, setPromotingId] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const response = (await forgeAPI.board.get
        .input({})
        .query()) as BoardResponse
      setBoard(normalizeBoard(response))
      setError(false)
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])
  const total = useMemo(
    () => board.personal.length + board.work.length,
    [board]
  )

  const onPromote = async (taskId: string) => {
    setPromotingId(taskId)

    try {
      await forgeAPI.board.promote.mutate({ taskId })
      await refresh()
    } catch {
      setError(true)
    } finally {
      setPromotingId(null)
    }
  }

  const onDrop = async (lane: 'personal' | 'work', status: Column) => {
    if (!dragged) return
    if (
      (dragged.source === 'personal' && lane !== 'personal') ||
      (dragged.source === 'mission' && lane !== 'work')
    )
      return

    const item = dragged
    setDragged(null)
    setBoard(current => ({
      personal:
        lane === 'personal'
          ? [
              ...current.personal.filter(
                candidate =>
                  candidate.id !== item.id || candidate.source !== item.source
              ),
              { ...item, status }
            ]
          : current.personal.filter(
              candidate =>
                candidate.id !== item.id || candidate.source !== item.source
            ),
      work:
        lane === 'work'
          ? [
              ...current.work.filter(
                candidate =>
                  candidate.id !== item.id || candidate.source !== item.source
              ),
              { ...item, status }
            ]
          : current.work.filter(
              candidate =>
                candidate.id !== item.id || candidate.source !== item.source
            )
    }))

    try {
      await forgeAPI.board.move.mutate({
        source: item.source,
        id: item.id,
        status
      })
      await refresh()
    } catch {
      setError(true)
      await refresh()
    }
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#fafafa]">
      <ModuleHeader />
      <main className="mx-auto w-full max-w-[1700px] space-y-8 px-6 py-6 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {t('board.eyebrow')}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {t('board.title')}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">{t('board.subtitle')}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500 shadow-sm">
            <span className="font-semibold text-zinc-900">{total}</span>{' '}
            {t('board.items')}
          </div>
        </header>
        {error && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {t('board.error')}
          </p>
        )}
        <div className="space-y-8">
          <Lane
            items={board.personal}
            lane="personal"
            promotingId={promotingId}
            onDragStart={setDragged}
            onDrop={onDrop}
            onPromote={onPromote}
          />
          <Lane
            items={board.work}
            lane="work"
            promotingId={promotingId}
            onDragStart={setDragged}
            onDrop={onDrop}
            onPromote={onPromote}
          />
        </div>
      </main>
    </div>
  )
}
