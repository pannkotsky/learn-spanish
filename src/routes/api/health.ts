import { createFileRoute } from '@tanstack/react-router'

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
} as const

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          JSON.stringify({
            status: 'ok',
            at: new Date().toISOString(),
          }),
          { status: 200, headers: jsonHeaders },
        ),
      HEAD: () => new Response(null, { status: 200, headers: jsonHeaders }),
    },
  },
})
