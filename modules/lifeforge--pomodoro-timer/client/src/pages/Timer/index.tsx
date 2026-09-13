import { useEffect, useRef } from 'react'

import { useModalStore } from '@lifeforge/ui'

import SessionEndedModal from '@/modal/SessionEndedModal'
import { useActiveSession } from '@/providers/ActiveSessionProvider'
import { useCurrentSession } from '@/providers/CurrentSessionProvider'

import NewSessionScreen from '../NewSessionScreen'
import ControlButtons from './components/ControlButtons'
import Header from './components/Header'
import ProgressBars from './components/ProgressBars'
import ProgressCircle from './components/ProgressCircle'
import StatusSection from './components/StatusSection'

export default function Timer() {
  const currentSession = useCurrentSession()
  const { setActiveSession } = useActiveSession()
  const { open } = useModalStore()
  const hasOpenedModalRef = useRef(false)

  // When session becomes completed, open modal and clear active session
  useEffect(() => {
    if (
      currentSession &&
      currentSession.session.status === 'completed' &&
      !hasOpenedModalRef.current
    ) {
      hasOpenedModalRef.current = true

      open(SessionEndedModal, {
        sessionId: currentSession.session.id
      })

      setActiveSession(null)
    }
  }, [currentSession, open, setActiveSession])

  // Reset the ref when session changes
  useEffect(() => {
    if (!currentSession) {
      hasOpenedModalRef.current = false
    }
  }, [currentSession])

  if (!currentSession) {
    return <></>
  }

  if (currentSession.session.status === 'new') {
    return (
      <NewSessionScreen
        changeStatus={currentSession.changeStatus}
        session={currentSession.session}
      />
    )
  }

  // Completed sessions are handled by the useEffect above
  if (currentSession.session.status === 'completed') {
    return <></>
  }

  return (
    <>
      <Header />
      <div className="flex-center flex-1 flex-col gap-6 p-8">
        <StatusSection />
        <ProgressCircle />
        <ProgressBars />
        <ControlButtons />
      </div>
    </>
  )
}
