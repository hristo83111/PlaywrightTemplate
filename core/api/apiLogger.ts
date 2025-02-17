import { APIResponse } from '@playwright/test'

// Types
import { ResponseStatusCodes } from 'core/api/types/StatusCodes'

/**
 * Logs detailed information about an API request and response when the response status code
 * does not match the expected status code. This function helps in debugging failed requests by
 * providing valuable information such as the request body, response body, status codes, and headers.
 *
 * The function performs the following actions:
 * - If the response status matches the expected status code, the function returns without logging any details.
 * - If the status codes do not match, it formats and logs the request and response bodies (with proper handling for JSON formatting).
 * - Logs the actual and expected status codes, request and response bodies, and headers to the console for debugging.
 *
 * @param response - The API response object, which contains information such as the status code, body, and headers.
 * @param expectedStatusCode - The status code that was expected from the API response.
 * @param request - An optional parameter representing the body of the request that was sent. Default is `undefined`.
 *
 * @returns `void` - This function does not return any value, it only logs the details to the console.
 */
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
