import { useQuery } from '@tanstack/react-query'
import _ from 'lodash'
import { useMemo } from 'react'
import { AutoSizer } from 'react-virtualized'

import { type InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Icon, ModalHeader, Scrollbar, WithQuery } from '@lifeforge/ui'

import { useSessionStyles } from '@/hooks/useSessionStyles'
import { forgeAPI } from '@/manifest'
import formatTime from '@/utils/formatTime'

import StatsCard from '../pages/Timer/components/StatsCard'

type SubSession = InferOutput<typeof forgeAPI.sessions.listSubSessions>[number]

interface Cycle {
  cycleNumber: number
  subSessions: SubSession[]
}

function SessionEndedModal({
  onClose,
  data: { sessionId }
}: {
  onClose: () => void
  data: {
    sessionId: string
  }
}) {
  const { t } = useModuleTranslation()
  const sessionStyles = useSessionStyles()

  const sessionQuery = useQuery(
    forgeAPI.sessions.getById.input({ id: sessionId }).queryOptions()
  )

  const subSessionsQuery = useQuery(
    forgeAPI.sessions.listSubSessions.input({ sessionId }).queryOptions()
  )

  // Group subsessions by cycle
  const cycles = useMemo(() => {
    if (!subSessionsQuery.data) return []

    const result: Cycle[] = []

    let currentCycle: Cycle = { cycleNumber: 1, subSessions: [] }

    for (const subSession of subSessionsQuery.data) {
      currentCycle.subSessions.push(subSession)

      // After a long break, start new cycle
      if (subSession.type === 'long_break') {
        result.push(currentCycle)
        currentCycle = {
          cycleNumber: currentCycle.cycleNumber + 1,
          subSessions: []
        }
      }
    }

    // Push remaining cycle if it has subsessions
    if (currentCycle.subSessions.length > 0) {
      result.push(currentCycle)
    }

    return result
  }, [subSessionsQuery.data])

  const totalBreakTime = useMemo(() => {
    if (!subSessionsQuery.data) return 0

    return subSessionsQuery.data
      .filter(s => s.type !== 'work')
      .reduce((sum, s) => sum + s.duration_elapsed, 0)
  }, [subSessionsQuery.data])

  return (
    <div className="flex min-h-[calc(100vh-8rem)] min-w-[70vw] flex-col">
      <WithQuery query={sessionQuery}>
        {session => (
          <>
            <ModalHeader
              icon="tabler:history"
              title={
                <div>
                  <div>{session.name}</div>
                  <p className="text-bg-500 mt-0.5 text-sm">
                    {t('timer.sessionConfig', {
                      durations: `${session.work_duration} / ${session.short_break_duration} / ${session.long_break_duration}`,
                      perCycle: session.session_until_long_break
                    })}
                  </p>
                </div>
              }
              onClose={onClose}
            />
            {/* Summary stats using StatsCard */}
            <StatsCard breakTime={totalBreakTime} session={session} />
            <div className="mt-6 flex h-full flex-1 flex-col">
              <AutoSizer>
                {({ width, height }) => (
                  <Scrollbar style={{ width, height }}>
                    <WithQuery query={subSessionsQuery}>
                      {() => (
                        <div className="space-y-8 pb-8">
                          {cycles.map(cycle => (
                            <div key={`cycle-${cycle}`}>
                              <h3 className="mb-3 text-xl font-medium">
                                {t('timer.cycleCount', {
                                  current: cycle.cycleNumber
                                })}
                              </h3>
                              <div className="space-y-2">
                                {cycle.subSessions.map((subSession, idx) => (
                                  <Card
                                    key={idx}
                                    className="component-bg-lighter! flex items-center gap-3"
                                  >
                                    <div
                                      className="rounded-lg p-2"
                                      style={{
                                        backgroundColor:
                                          sessionStyles[subSession.type].color +
                                          '20'
                                      }}
                                    >
                                      <Icon
                                        className="size-5"
                                        icon={
                                          sessionStyles[subSession.type].icon
                                        }
                                        style={{
                                          color:
                                            sessionStyles[subSession.type].color
                                        }}
                                      />
                                    </div>
                                    <span className="flex-1 font-medium">
                                      {t(
                                        `timer.${_.camelCase(subSession.type)}`
                                      )}
                                    </span>
                                    <p>
                                      <span className="font-medium">
                                        {formatTime(
                                          subSession.duration_elapsed
                                        )}
                                      </span>
                                      <span className="text-bg-500 text-sm">
                                        {' '}
                                        /{' '}
                                        {formatTime(
                                          session[
                                            (
                                              {
                                                work: 'work_duration',
                                                short_break:
                                                  'short_break_duration',
                                                long_break:
                                                  'long_break_duration'
                                              } as const
                                            )[subSession.type]
                                          ] * 60
                                        )}
                                      </span>
                                    </p>
                                    {subSession.is_completed ? (
                                      <Icon
                                        className="size-4 text-green-500"
                                        icon="tabler:check"
                                      />
                                    ) : (
                                      <Icon
                                        className="text-bg-400 size-4"
                                        icon="tabler:skip-forward"
                                      />
                                    )}
                                  </Card>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </WithQuery>
                  </Scrollbar>
                )}
              </AutoSizer>
            </div>
          </>
        )}
      </WithQuery>
    </div>
  )
}

export default SessionEndedModal
