import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useAuth } from '../../providers/AuthProvider'

function useAuthEffect() {
  const { auth, authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading) {
      if (!auth && location.pathname !== '/auth') {
        navigate(
          '/auth?redirect=' +
            (location.pathname === '/' ? '/dashboard' : location.pathname) +
            location.search
        )
      } else if (auth) {
        if (location.pathname === '/auth') {
          const redirect = new URLSearchParams(location.search).get('redirect')
          if (redirect !== null) {
            navigate(redirect)
          } else {
            navigate('/dashboard')
          }
        } else if (location.pathname === '/') {
          navigate('/dashboard')
        }
      }
    }
  }, [auth, location, authLoading])
}

export default useAuthEffect
