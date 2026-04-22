import { createMiddleware, createStart } from '@tanstack/react-start'

const requestLogger = createMiddleware().server(async ({ next, request, pathname }) => {
  if (!pathname.startsWith('/api/')) {
    return next()
  }

  const started = Date.now()
  const { method } = request
  const url = new URL(request.url)

  try {
    const result = await next()
    const ms = Date.now() - started
    console.log(`[api] ${method} ${pathname}${url.search} ${result.response.status} ${ms}ms`)
    return result
  } catch (err) {
    const ms = Date.now() - started
    console.error(`[api] ${method} ${pathname}${url.search} ERROR ${ms}ms`, err)
    throw err
  }
})

export const startInstance = createStart(() => ({
  requestMiddleware: [requestLogger],
}))
