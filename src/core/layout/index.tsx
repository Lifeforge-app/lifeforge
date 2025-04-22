import { useAuth } from '@providers/AuthProvider'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { LoadingScreen } from '@lifeforge/ui'

import Auth from '../pages/Auth'
import MainRoutesRenderer from './components/MainRoutesRenderer'
import useAuthEffect from './hooks/useAuthEffect'
import useTitleEffect from './hooks/useTitleEffect'

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

  if (authLoading) return <LoadingScreen customMessage="Loading user data" />
  if (!auth && location.pathname !== '/auth') return <Auth />

  return <MainRoutesRenderer />
}

export default AppRouter
