import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useNavigate } from '@lifeforge/shared'

function index() {
  const navigate = useNavigate()

  const { t } = useTranslation('common.fetch')

  useEffect(() => {
    const a = document.createElement('a')

    a.href = 'https://docs.lifeforge.dev'
    a.target = '_blank'
    a.click()

    navigate(-1)
    toast.success(t('redirected'))
  }, [])
}

export default index
