import { defineStore } from 'pinia'
import type { Post, PostDraft } from '~/types/post'
import { useToastStore } from '~/stores/toast'

interface PostsState {
  posts: Post[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  page: number
  pageSize: number
  total: number
  hasMore: boolean
  mode: 'buttons' | 'scroll'
  searchQuery: string
  tagFilter: string
  allTagPosts: Post[] // Store all posts for current tag (for client-side search)
}

const API_BASE = 'https://dummyjson.com/posts'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    mode: 'buttons',
    searchQuery: '',
    tagFilter: '',
    allTagPosts: []
  }),

  getters: {
    availableTags(): string[] {
      return [
        'history', 'american', 'crime', 'french', 'fiction', 'english',
        'magical', 'mystery', 'love', 'classic', 'memory', 'nostalgia',
        'nature', 'tranquility', 'life', 'books', 'market', 'vibrant'
      ]
    },

    // When both tag and search are active, filter from allTagPosts
    // When only tag, use posts (paginated from API)
    // When only search, use posts (from search API)
    filteredPosts(): Post[] {
      const query = this.searchQuery.trim().toLowerCase()
      
      // Both tag + search: filter from all tag posts
      if (this.tagFilter && query) {
        return this.allTagPosts.filter((post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
        )
      }
      
      // Search only (no tag): filter from current posts if needed
      if (query && !this.tagFilter) {
        return this.posts.filter((post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
        )
      }
      
      // Tag only or no filters
      return this.posts
    },

    // Total for display
    displayTotal(): number {
      if (this.tagFilter && this.searchQuery.trim()) {
        return this.filteredPosts.length
      }
      return this.total
    },

    totalPages(): number {
      if (this.tagFilter && this.searchQuery.trim()) {
        return Math.max(1, Math.ceil(this.filteredPosts.length / this.pageSize))
      }
      return Math.max(1, Math.ceil(this.total / this.pageSize))
    },

    showingFrom(): number {
      if (this.total === 0) return 0
      return (this.page - 1) * this.pageSize + 1
    },

    showingTo(): number {
      return Math.min(this.page * this.pageSize, this.total)
    },

    postById(state) {
      return (id: number) => state.posts.find((post) => post.id === id)
    }
  },

  actions: {
    // Build API URL
    _buildUrl(page: number, limit?: number): string {
      const skip = (page - 1) * (limit || this.pageSize)
      const pageLimit = limit || this.pageSize

      // If tag is active: use tag endpoint
      if (this.tagFilter) {
        return `${API_BASE}/tag/${encodeURIComponent(this.tagFilter)}?limit=${pageLimit}&skip=${skip}`
      }

      // If search only: use search endpoint
      const query = this.searchQuery.trim()
      if (query) {
        return `${API_BASE}/search?q=${encodeURIComponent(query)}&limit=${pageLimit}&skip=${skip}`
      }

      // Default: all posts
      return `${API_BASE}?limit=${pageLimit}&skip=${skip}`
    },

    async fetchPage(page: number) {
      this.loading = true
      this.error = null
      
      try {
        // If both tag + search, fetch ALL posts for the tag (up to 100)
        // then filter client-side
        if (this.tagFilter && this.searchQuery.trim()) {
          const url = `${API_BASE}/tag/${encodeURIComponent(this.tagFilter)}?limit=100&skip=0`
          const data = await $fetch<{ posts: Post[]; total: number }>(url)
          this.allTagPosts = data.posts
          this.total = data.total
          
          // Apply client-side search filter
          const query = this.searchQuery.trim().toLowerCase()
          this.posts = data.posts.filter((post) =>
            post.title.toLowerCase().includes(query) ||
            post.body.toLowerCase().includes(query)
          ).slice(0, this.pageSize)
          
          this.page = 1
          this.hasMore = this.filteredPosts.length > this.pageSize
        } else {
          // Normal API call (tag only, search only, or no filters)
          const url = this._buildUrl(page)
          const data = await $fetch<{ posts: Post[]; total: number }>(url)
          this.posts = data.posts
          this.total = data.total
          this.page = page
          this.hasMore = this.posts.length < this.total
          this.allTagPosts = []
        }
      } catch (err) {
        this.error = 'Could not load posts. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async fetchNextPage() {
      if (this.loadingMore || !this.hasMore) return
      
      // Don't fetch next page if both tag + search (all data already loaded)
      if (this.tagFilter && this.searchQuery.trim()) return
      
      this.loadingMore = true
      const startTime = Date.now()

      try {
        const nextPage = this.page + 1
        const url = this._buildUrl(nextPage)
        const data = await $fetch<{ posts: Post[]; total: number }>(url)

        const elapsed = Date.now() - startTime
        const minDelay = 600
        if (elapsed < minDelay) {
          await new Promise((r) => setTimeout(r, minDelay - elapsed))
        }

        this.posts.push(...data.posts)
        this.page = nextPage
        this.hasMore = this.posts.length < data.total
      } catch (err) {
        this.error = 'Could not load more posts.'
      } finally {
        this.loadingMore = false
      }
    },

    async fetchSinglePost(id: number): Promise<Post | null> {
      try {
        return await $fetch<Post>(`${API_BASE}/${id}`)
      } catch (err) {
        return null
      }
    },

    async updatePost(id: number, draft: PostDraft) {
      const toast = useToastStore()
      await delay(400)
      try {
        const updated = await $fetch<Post>(`${API_BASE}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft)
        })
        const index = this.posts.findIndex((p) => p.id === id)
        if (index !== -1) this.posts[index] = updated
        // Also update in allTagPosts if present
        const tagIndex = this.allTagPosts.findIndex((p) => p.id === id)
        if (tagIndex !== -1) this.allTagPosts[tagIndex] = updated
        toast.success('Post updated successfully')
        return updated
      } catch (err) {
        toast.error('Failed to update post')
        throw new Error('Failed to update post')
      }
    },

    async deletePost(id: number) {
      const toast = useToastStore()
      await delay(400)
      try {
        await $fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
        this.posts = this.posts.filter((p) => p.id !== id)
        this.allTagPosts = this.allTagPosts.filter((p) => p.id !== id)
        this.total = Math.max(0, this.total - 1)
        toast.success('Post deleted successfully')
      } catch (err) {
        toast.error('Failed to delete post')
        throw new Error('Failed to delete post')
      }
    },

    setMode(mode: 'buttons' | 'scroll') {
      this.mode = mode
      this.page = 1
      this.posts = []
      this.allTagPosts = []
      this.hasMore = true
      this.fetchPage(1)
    },

    setTagFilter(tag: string) {
      this.tagFilter = tag
      this.page = 1
      this.posts = []
      this.allTagPosts = []
      this.hasMore = true
      this.fetchPage(1)
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
      this.page = 1
      this.posts = []
      this.hasMore = true
      this.fetchPage(1)
    },

    clearFilters() {
      this.searchQuery = ''
      this.tagFilter = ''
      this.page = 1
      this.posts = []
      this.allTagPosts = []
      this.hasMore = true
      this.fetchPage(1)
    }
  }
})