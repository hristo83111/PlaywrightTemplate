type Urls = {
  conduit: string
  admin: string
}

export type EnvironmentSettings = {
  uiUrls: Urls
  apiUrls: Urls
  database?: {
    serverName: string
  }
}
