import type { HTTPGraphQLRequest, HTTPGraphQLResponse } from '@apollo/server'
import { HeaderMap } from '@apollo/server'

export async function fetchRequestToHttpGraphQLRequest(
  request: Request,
): Promise<HTTPGraphQLRequest> {
  const headers = new HeaderMap()
  request.headers.forEach((value, key) => {
    headers.set(key, value)
  })

  const url = new URL(request.url)
  let body: unknown
  const method = request.method.toUpperCase()

  if (method !== 'GET' && method !== 'HEAD') {
    const contentType = request.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const text = await request.text()
      body = text.length > 0 ? JSON.parse(text) : undefined
    }
  }

  return {
    method,
    headers,
    search: url.search,
    body,
  }
}

export function httpGraphQLResponseToFetchResponse(graphqlResponse: HTTPGraphQLResponse): Response {
  const headers = new Headers()
  for (const [key, value] of graphqlResponse.headers) {
    headers.append(key, value)
  }

  const status = graphqlResponse.status ?? 200

  const { body } = graphqlResponse
  if (body.kind === 'complete') {
    return new Response(body.string, { status, headers })
  }

  const { asyncIterator } = body
  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of asyncIterator) {
            controller.enqueue(new TextEncoder().encode(chunk))
          }
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      },
    }),
    { status, headers },
  )
}
