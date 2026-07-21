# Tasklist

A small task management app built with Nuxt 3 (Vue 3 + Composition API), Pinia, TypeScript, Tailwind CSS and SCSS.

## Features

**Tasks**

- Task list with title, description, status (Pending / In Progress / Done) and due date
- Add / edit / delete tasks, with a form modal shared between the two flows
- Client-side validation: title is required, due date must be in the future
- Filter by status and search by title, combinable
- Task detail page (`/tasks/:id`) - view, edit, or delete from there too
- Deleting a task (from the list or the detail page) opens a confirm dialog instead of the browser's native `confirm()`
- Loading, error and empty states, all handled explicitly (no silent failures)
- Mock "API" (local seed data + a simulated network delay) behind a Pinia store, so swapping in a real backend later is a one-file change

**Posts**

- A second section (`/posts` list + `/posts/:id` detail) that fetches real data from [DummyJSON](https://dummyjson.com/) (`GET /posts`)
- Search by title/body and filter by tag, combinable - backed by DummyJSON's `/posts/search` and `/posts/tag/:tag` endpoints
- Edit / delete posts against the live API, with the same modal + confirm dialog pattern used for tasks
- Two pagination styles, switchable via a toggle on the list page:
  - **Page buttons** - first/prev/numbered pages/next/last, using `limit`/`skip` query params and the `total` count from the response body
  - **Infinite scroll** - loads the next page automatically as you scroll, via `IntersectionObserver`
- Loading spinner on first load and page changes; a smaller inline spinner while infinite scroll fetches more

**Shared**

- Toast notifications (success/error) for create, update and delete actions across both Tasks and Posts
- Scroll-to-top button
- Shared loading, error and empty states, modal, and confirm dialog components reused by both sections

**Testing**

- Unit tests (Vitest) covering the validation helper and the tasks store

## Stack

- Nuxt 3 (Composition API, `<script setup>`)
- Pinia for state management
- TypeScript
- Tailwind CSS for layout/utility styling, SCSS for shared tokens (colors, mixins, status-color map) and a few hand-written animations
- Vitest + @vue/test-utils for unit tests

## Getting started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:3000)
npm run dev

# run unit tests
npm run test
npm run test:watch

# production build
npm run build
npm run preview
```

## Project structure

```
app/
  components/
    Tasks/
      TaskCard.vue, TaskForm.vue, TaskFilters.vue
    Posts/
      PostCard.vue, PostForm.vue, PostFilters.vue
    Toasts/
      ToastContainer.vue, ToastItem.vue
    Shared/
      AppHeader.vue, ModalDialog.vue, ConfirmDialog.vue, PaginationControls.vue,
      ScrollTopButton.vue, Spinner.vue, StatusBadge.vue,
      LoadingState.vue, ErrorState.vue, EmptyState.vue
  pages/
    index.vue           # task list
    tasks/[id].vue       # task detail - edit or delete
    posts/index.vue      # DummyJSON list: search, tag filter, both pagination modes, edit/delete
    posts/[id].vue        # post detail - edit or delete
  stores/
    tasks.ts   # Pinia store: state, mock fetch, CRUD, filtering getters
    posts.ts   # Pinia store: fetchPage (buttons) / fetchNextPage (scroll), search, tag filter, CRUD
    toast.ts   # Pinia store backing the toast notifications
  types/
    task.ts, post.ts, toast.ts
  utils/
    validateTask.ts   # form validation, unit tested in isolation
    mockTasks.ts       # seed data standing in for a backend
  assets/scss/
    main.scss   # color tokens, status color map, shared mixins
tests/
  validateTask.test.ts
  tasksStore.test.ts
```

## Design notes

- **Where the mock task API lives**: `stores/tasks.ts` has a `fetchTasks` action that awaits a `setTimeout`-based delay before populating state from `utils/mockTasks.ts`. Pointing this at a real endpoint later just means replacing the body of that one action with a `$fetch` call.
- **Posts pagination**: `stores/posts.ts` keeps `loading` (full-page spinner) separate from `loadingMore` (the small inline spinner used only during infinite scroll), so the two pagination modes don't fight over the same flag. Switching modes, changing the search query, or changing the tag filter all reset the list and re-fetch page 1.
- **Posts search/tag routing**: `_buildUrl` picks the right DummyJSON endpoint based on state - tag endpoint when a tag is set, search endpoint when only a query is set, plain listing otherwise - so both filters can be combined via query params.
- **Validation** is a plain function (`utils/validateTask.ts`) rather than being baked into the form component, so it can be unit tested without mounting anything.
- **Styling split**: Tailwind utility classes handle spacing/layout directly in templates; SCSS (`main.scss`) holds the color tokens, the status-color map (which also drives each task card's left "status rail"), and a couple of small mixins/animations that are easier to express as real CSS than as utility classes.
- **Filtering** (status + search) is a Pinia getter (`filteredTasks`) so the list, the "X of Y shown" count, and any future consumer all stay in sync automatically.
- **Toasts** live in their own store (`stores/toast.ts`) and are triggered from within the CRUD actions of both the tasks and posts stores, rather than from the components calling those actions.

## Possible next steps

- Persist tasks (localStorage or a real API) so they survive a refresh
- Add pagination or virtualization if the task list itself grows large
- Add optimistic updates for post edits/deletes so the UI doesn't wait on the round trip
