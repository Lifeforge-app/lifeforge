import { useAuth } from '@providers/AuthProvider'
import { useLocation } from 'react-router'

import { LoadingScreen } from '@lifeforge/ui'

import Auth from '../auth'
import MainRoutesRenderer from './components/MainRoutesRenderer'
import useAuthEffect from './hooks/useAuthEffect'
import useTitleEffect from './hooks/useTitleEffect'

function AppRouter() {
  const { auth, authLoading } = useAuth()
  const location = useLocation()

  useAuthEffect()
  useTitleEffect()

  if (authLoading) return <LoadingScreen customMessage="Loading user data" />
  if (!auth && location.pathname !== '/auth') return <Auth />

  return <MainRoutesRenderer />
}

export default AppRouter
