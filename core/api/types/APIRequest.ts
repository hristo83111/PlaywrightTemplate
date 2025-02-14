import { ReadStream } from 'fs'

export interface APIRequest {
  url: string
  options: {
    /**
     * Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string and
     * `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type` header will
     * be set to `application/octet-stream` if not explicitly set.
     */
    data?: unknown

    /**
     * Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status codes.
     */
    failOnStatusCode?: boolean
    /**
     * Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent as
     * this request body. If this parameter is specified `content-type` header will be set to
     * `application/x-www-form-urlencoded` unless explicitly provided.
     */
    form?: Record<string, string | number | boolean>

    /**
     * Allows to set HTTP headers.
     */
    headers?: Record<string, string>

    /**
     * Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
     */
    ignoreHTTPSErrors?: boolean

    /**
     * Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as this request
     * body. If this parameter is specified `content-type` header will be set to `multipart/form-data` unless explicitly
     * provided. File values can be passed either as [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream)
     * or as file-like object containing file name, mime-type and its content.
     */
    multipart?: Record<
      string,
      | string
      | number
      | boolean
      | ReadStream
      | {
          /**
           * File name
           */
          name: string

          /**
           * File type
           */
          mimeType: string

          /**
           * File content
           */
          buffer: Buffer
        }
    >

    /**
     * Query parameters to be sent with the URL.
     */
    params?: Record<string, string | number | boolean>

    /**
     * Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
     */
    timeout?: number
  }
}
