export interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
  userId: number
}

export interface PostDraft {
  title: string
  body: string
  userId: number
  tags?: string[]
}