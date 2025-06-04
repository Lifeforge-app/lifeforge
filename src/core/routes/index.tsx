import MainRoutesRenderer from '@core/routes/components/MainRoutesRenderer'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import {
  ColorPickerModal,
  DeleteConfirmationModal,
  FileAndImagePickerModal,
  IconPickerModal,
  LoadingScreen
} from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'

import Auth from '../pages/Auth'
import { useAuth } from '../providers/AuthProvider'
import useAuthEffect from './hooks/useAuthEffect'
import useTitleEffect from './hooks/useTitleEffect'

const DEFAULT_MODALS = {
  deleteConfirmation: DeleteConfirmationModal,
  iconPicker: IconPickerModal,
  colorPicker: ColorPickerModal,
  fileAndImagePicker: FileAndImagePickerModal
}

function AppRouter() {
  const navigate = useNavigate()
  const { auth, authLoading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (auth && location.pathname === '/') {
      navigate('/dashboard')
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
