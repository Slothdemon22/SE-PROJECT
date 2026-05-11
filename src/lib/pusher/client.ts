import Pusher from 'pusher-js';

// Fix for "default is not a constructor" error in some ESM/Next.js environments
const PusherConstructor = (Pusher as any).default || Pusher;

export const pusherClient = typeof window !== 'undefined'
  ? new PusherConstructor(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  : null as any;
