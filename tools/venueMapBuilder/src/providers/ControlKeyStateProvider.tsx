import { createContext, useContext, useEffect, useState } from 'react'

const ControlKeyStateContext = createContext<boolean>(false)

function ControlKeyEventProvider({ children }: { children: React.ReactNode }) {
  const [isControlPressed, setIsControlPressed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setIsControlPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setIsControlPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <ControlKeyStateContext value={isControlPressed}>
      {children}
    </ControlKeyStateContext>
  )
}

export function useControlKeyState() {
  const context = useContext(ControlKeyStateContext)

  if (context === undefined) {
    throw new Error(
      'useControlKeyState must be used within a ControlKeyEventProvider'
    )
  }

  return context
}

export default ControlKeyEventProvider
