import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useLiveParkingSync() {
  const setWebsocketConnected = useAppStore((state) => state.setWebsocketConnected)
  const simulateRealtimeTick = useAppStore((state) => state.simulateRealtimeTick)

  useEffect(() => {
    setWebsocketConnected(true)

    const timer = window.setInterval(() => {
      simulateRealtimeTick()
    }, 3500)

    return () => {
      window.clearInterval(timer)
      setWebsocketConnected(false)
    }
  }, [setWebsocketConnected, simulateRealtimeTick])
}
