import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useNavigate } from 'shared'

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

  return (
    <>
      <div className="flex size-full items-center justify-center">
        <p className="text-bg-500 text-2xl font-medium">{t('redirecting')}</p>
      </div>
    </>
  )
}

export default index
