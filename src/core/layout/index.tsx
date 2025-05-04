import { useAuth } from '@providers/AuthProvider'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { DeleteConfirmationModal, LoadingScreen } from '@lifeforge/ui'

import useModalsEffect from '../modals/useModalsEffect'
import Auth from '../pages/Auth'
import MainRoutesRenderer from './components/MainRoutesRenderer'
import useAuthEffect from './hooks/useAuthEffect'
import useTitleEffect from './hooks/useTitleEffect'

const DEFAULT_MODALS = {
  deleteConfirmation: DeleteConfirmationModal
}

function AppRouter() {
  const { auth, authLoading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (auth && location.pathname === '/') {
      window.location.href = '/dashboard'
    }
  }, [auth, location.pathname])

  useAuthEffect()
  useTitleEffect()
  useModalsEffect(DEFAULT_MODALS)

  if (authLoading) return <LoadingScreen customMessage="Loading user data" />
  if (!auth && location.pathname !== '/auth') return <Auth />

  return <MainRoutesRenderer />
}

export default AppRouter
