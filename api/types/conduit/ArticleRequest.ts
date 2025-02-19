export interface Article {
  title: string
  description: string
  body: string
  tagList: string[]
}

export interface ArticleRequest {
  article: Article
}
