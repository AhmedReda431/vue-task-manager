import { defineStore } from "pinia";
import type { Post, PaginationMode } from "~/types/post";

// dummyjson's list response shape: { posts, total, skip, limit }
interface DummyJsonPostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

interface PostsState {
  posts: Post[];
  page: number;
  limit: number;
  total: number;
  mode: PaginationMode;
  loading: boolean; // first load of a page, or switching mode - shows the full spinner
  loadingMore: boolean; // appending the next page during infinite scroll
  error: string | null;
}

const API_URL = "https://dummyjson.com/posts";

export const usePostsStore = defineStore("posts", {
  state: (): PostsState => ({
    posts: [],
    page: 1,
    limit: 10,
    total: 0,
    mode: "buttons",
    loading: false,
    loadingMore: false,
    error: null,
  }),

  getters: {
    totalPages: (state) => Math.max(1, Math.ceil(state.total / state.limit)),
    hasMore: (state) => state.posts.length < state.total,
  },

  actions: {
    // Used by button pagination: replaces the current page of results.
    // dummyjson paginates with limit/skip rather than a page number, so
    // we convert our page number into a skip offset here.
    async fetchPage(page: number) {
      this.loading = true;
      this.error = null;

      try {
        const skip = (page - 1) * this.limit;
        const response = await $fetch<DummyJsonPostsResponse>(API_URL, {
          query: { limit: this.limit, skip },
        });

        this.posts = response.posts ?? [];
        this.page = page;
        this.total = response.total ?? this.posts.length;
      } catch (err) {
        this.error = "Could not load posts. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    // Used by infinite scroll: appends the next page instead of replacing.
    async fetchNextPage() {
      if (this.loadingMore || this.loading || !this.hasMore) return;

      this.loadingMore = true;
      this.error = null;

      const nextPage = this.page + 1;
      const skip = (nextPage - 1) * this.limit;

      try {
        // Simulate a real API request
        await new Promise((resolve) => setTimeout(resolve, 800));

        const response = await $fetch<DummyJsonPostsResponse>(API_URL, {
          query: {
            limit: this.limit,
            skip,
          },
        });

        this.posts.push(...(response.posts ?? []));
        this.page = nextPage;

        if (response.total) {
          this.total = response.total;
        }
      } catch {
        this.error = "Could not load more posts.";
      } finally {
        this.loadingMore = false;
      }
    },

    async setMode(mode: PaginationMode) {
      if (this.mode === mode) return;
      this.mode = mode;
      this.posts = [];
      this.page = 1;
      this.total = 0;
      await this.fetchPage(1);
    },
  },
});
