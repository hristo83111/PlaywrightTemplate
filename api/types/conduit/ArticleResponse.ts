import { Article } from 'api/types/conduit/ArticleRequest'

interface Author {
  username: string
  bio?: unknown
  image?: string
  following?: boolean
}

export interface ArticleData extends Article {
  slug?: string
  createdAt?: string
  updatedAt?: string
  favorited?: boolean
  favoritesCount?: number
  author?: Author
}

export interface ArticleResponse {
  article: ArticleData
}
