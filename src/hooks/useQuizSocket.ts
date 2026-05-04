import useWebSocket, { ReadyState } from 'react-use-websocket'

export function useQuizSocket(roomCode: string, onMessage: (data: any) => void) {
  const WS_URL = import.meta.env.VITE_WS_URL

  const { sendJsonMessage, readyState } = useWebSocket(
    `${WS_URL}/ws/${roomCode}`,
    {
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage(data)
        } catch {}
      },
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 2000,
    }
  )

  const isConnected = readyState === ReadyState.OPEN

  return { sendJsonMessage, isConnected }
}
