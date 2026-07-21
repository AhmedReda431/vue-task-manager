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
- A second page (`/posts`) that fetches real data from JSONPlaceholder (`GET /posts`)
- Two pagination styles, switchable via tabs on the same page:
  - **Page buttons** - prev/next plus numbered pages, using `_page`/`_limit` query params and the `X-Total-Count` response header
  - **Infinite scroll** - loads the next page automatically as you scroll, via `IntersectionObserver`
- Loading spinner on first load and page changes; a smaller inline spinner while infinite scroll fetches more

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

# production build
npm run build
npm run preview
```

## Project structure

```
app/
  components/
    TaskCard.vue, TaskForm.vue, TaskFilters.vue, StatusBadge.vue   # tasks
    PostCard.vue                                                    # posts
    AppHeader.vue, ModalDialog.vue, ConfirmDialog.vue, Spinner.vue  # shared
    LoadingState.vue, ErrorState.vue, EmptyState.vue                # shared
  pages/
    index.vue        # task list
    tasks/[id].vue    # task detail - edit or delete
    posts.vue         # JSONPlaceholder list with both pagination modes
  stores/
    tasks.ts          # Pinia store: state, mock fetch, CRUD, filtering getters
    posts.ts          # Pinia store: fetchPage (buttons) / fetchNextPage (scroll)
  types/
    task.ts, post.ts
  utils/
    validateTask.ts   # form validation, unit tested in isolation
    mockTasks.ts       # seed data standing in for a backend
  assets/scss/
    main.scss         # color tokens, status color map, shared mixins
tests/
  validateTask.test.ts
  tasksStore.test.ts
```

## Design notes

- **Where the mock task API lives**: `stores/tasks.ts` has a `fetchTasks` action that awaits a `setTimeout`-based delay before populating state from `utils/mockTasks.ts`. Pointing this at a real endpoint later just means replacing the body of that one action with a `$fetch` call.
- **Posts pagination**: `stores/posts.ts` keeps `loading` (full-page spinner) separate from `loadingMore` (the small inline spinner used only during infinite scroll), so the two pagination modes don't fight over the same flag. Switching modes resets the list and re-fetches page 1.
- **Validation** is a plain function (`utils/validateTask.ts`) rather than being baked into the form component, so it can be unit tested without mounting anything.
- **Styling split**: Tailwind utility classes handle spacing/layout directly in templates; SCSS (`main.scss`) holds the color tokens, the status-color map (which also drives each task card's left "status rail"), and a couple of small mixins/animations that are easier to express as real CSS than as utility classes.
- **Filtering** (status + search) is a Pinia getter (`filteredTasks`) so the list, the "X of Y shown" count, and any future consumer all stay in sync automatically.

## Possible next steps

- Swap the mock task store action for a real `$fetch`/`useFetch` call once there's a backend
- Persist tasks (localStorage or a real API) so they survive a refresh
- Add pagination or virtualization if the task list itself grows large
