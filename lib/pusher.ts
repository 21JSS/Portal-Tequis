import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

// Para evitar que en desarrollo se cree una instancia nueva en cada reload
const globalForPusher = global as unknown as { pusherServer: PusherServer | null }

const hasPusherConfig =
  process.env.PUSHER_APP_ID &&
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY &&
  process.env.PUSHER_SECRET &&
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER

export const pusherServer: PusherServer | null = hasPusherConfig
  ? globalForPusher.pusherServer ||
    new PusherServer({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    })
  : null

if (process.env.NODE_ENV !== 'production' && pusherServer) {
  globalForPusher.pusherServer = pusherServer
}

// El cliente solo se crea en el browser y solo si hay keys configuradas
export const pusherClient: PusherClient | null =
  typeof window !== 'undefined' && hasPusherConfig
    ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      })
    : null

