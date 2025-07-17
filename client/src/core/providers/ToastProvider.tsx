import { ToastContainer } from 'react-toastify'

import { usePersonalization } from './PersonalizationProvider'

function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = usePersonalization()
  return (
    <>
      {children}
      <ToastContainer
        closeOnClick
        draggable
        pauseOnFocusLoss
        pauseOnHover
        autoClose={3000}
        newestOnTop={false}
        position="bottom-center"
        rtl={false}
        theme={theme}
      />
    </>
  )
}

export default ToastProvider
