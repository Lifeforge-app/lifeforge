import { cookieParse } from 'pocketbase'
import { createContext, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)

export interface SocketEvent<
  T,
  P extends string | number | Record<string, string | number> = string
> {
  taskId: string
  module: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  data?: T
  error?: string
  progress?: P
}

export default function SocketProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_HOST, {
      auth: {
        token: cookieParse(document.cookie).session
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
      setSocket(null)
    }
  }, [])

  return <SocketContext value={socket}>{children}</SocketContext>
}

export function useSocketContext(): Socket {
  const context = useContext(SocketContext)

  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider')
  }

  return context
}
