import type { Session } from '@'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Icon,
  TagChip,
  anyColorToHex,
  toast,
  useModalStore
} from '@lifeforge/ui'

import STATUS_STYLES from '@/constants/status_styles'
import { forgeAPI } from '@/manifest'
import ModifySessionModal from '@/modal/ModifySessionModal'
import SessionEndedModal from '@/modal/SessionEndedModal'
import { useActiveSession } from '@/providers/ActiveSessionProvider'
import formatTime from '@/utils/formatTime'

function SessionCard({ session }: { session: Session }) {
  const qc = useQueryClient()
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const { setActiveSession } = useActiveSession()

  const deleteMutation = useMutation(
    forgeAPI.sessions.remove
      .input({
        id: session.id
      })
      .mutationOptions({
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: forgeAPI.sessions.list.key
          })
        },
        onError: (error: Error) => {
          console.error('Error deleting session:', error)
          toast.error('An error occurred while deleting the session.')
        }
      })
  )

  function handleDelete() {
    open(ConfirmationModal, {
      title: 'Delete Session',
      description: `Are you sure you want to delete the session "${session.name}"? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }

  function handleClick() {
    if (session.status === 'completed') {
      open(SessionEndedModal, {
        sessionId: session.id
      })
    } else {
      setActiveSession(session.id)
    }
  }

  return (
    <Card
      key={session.id}
      isInteractive
      className="flex-between gap-8"
      onClick={handleClick}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div
          className="rounded-lg p-3"
          style={{
            color: STATUS_STYLES[session.status].color,
            backgroundColor:
              anyColorToHex(STATUS_STYLES[session.status].color) + '20'
          }}
        >
          <Icon className="size-7" icon={STATUS_STYLES[session.status].icon} />
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-lg font-medium">
            {session.name}
            <TagChip
              className="hidden px-1.5! py-0.5! text-xs! sm:flex"
              color={STATUS_STYLES[session.status].color}
              icon={STATUS_STYLES[session.status].icon}
              label={t(`statuses.${session.status}`)}
            />
          </h3>
          <div className="text-bg-500 mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:mt-1">
            <div className="text-bg-500 flex items-center gap-1.5">
              <Icon className="size-4 shrink-0" icon="tabler:clock" />
              <span>
                {t('timer.sessionConfig', {
                  durations: `${session.work_duration} / ${session.short_break_duration} / ${session.long_break_duration}`,
                  perCycle: session.session_until_long_break
                })}
              </span>
            </div>
            {session.status !== 'new' && (
              <div className="text-bg-500 flex items-center gap-1.5">
                <Icon className="size-4 shrink-0" icon="tabler:flag-check" />
                <span>
                  {t('timer.pomodoroDone', {
                    count: session.pomodoro_count,
                    total: formatTime(Number(session.total_time_elapsed))
                  })}
                </span>
              </div>
            )}
            <div className="text-bg-500 flex items-center gap-1.5">
              <Icon className="size-4 shrink-0" icon="tabler:calendar" />
              <span>{dayjs(session.created).format('DD MMM YYYY')}</span>
            </div>
          </div>
        </div>
      </div>
      <ContextMenu className="top-4 right-4 sm:static absolute">
        <ContextMenuItem
          icon="tabler:pencil"
          label="edit"
          onClick={() => {
            open(ModifySessionModal, {
              openType: 'update',
              initialData: session
            })
          }}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="delete"
          onClick={handleDelete}
        />
      </ContextMenu>
    </Card>
  )
}

export default SessionCard
