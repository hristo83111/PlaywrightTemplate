import { APIResponse } from '@playwright/test'

// Types
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

export const logAPIErrorDetailsOnFailure = async (
  response: APIResponse,
  expectedStatusCode: ResponseStatusCodes,
  request?: unknown
) => {
  if (response.status() === expectedStatusCode) {
    return
  }

  const responseBody = await response.text()

  const emptyBodyMessage = '<---empty body--->'

  const formatBody = (body: unknown) => {
    try {
      // If body is already a string, attempt to parse it
      const parsedBody = typeof body === 'string' ? JSON.parse(body) : body

      // Return body as formatted JSON string if parsedBody is defined, otherwise return '<---empty body--->'
      return parsedBody !== undefined
        ? JSON.stringify(parsedBody, null, 2)
        : emptyBodyMessage
    } catch (error) {
      // Return emty body if parsing fails
      return body || emptyBodyMessage
    }
  }

  // Format request and response bodies
  const formattedRequestBody = formatBody(request)
  const formattedResponseBody = formatBody(responseBody)

  console.error(`Executed call to --> ${response.url()}  ***FAILED*** \n`)
  console.error(`Expected status code: ${expectedStatusCode}`)
  console.error('Actual status code:', `${response.status()}\n`)
  console.error('Response Body:')
  console.error(`${formattedResponseBody} \n`)
  console.error(
    `Response headers: ${JSON.stringify(response.headers(), null, 2)} \n`
  )
  console.error('Request Body:')
  console.error(`${formattedRequestBody} \n`)
}
