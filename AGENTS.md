# AGENTS.md

Project-wide agent instructions.

## Git

- Never create, modify, or commit `package-lock.json` — this project uses bun (`bun.lock`)

## Style

- Be extremely concise, sacrifice grammar for the sake of conciseness
- When writing any text content, capitalize only the first word of each phrase

## Stack

- React 19 + TypeScript (Vite), React compiler on
- `@base-ui/react` primitives, `@hugeicons/react` icons
- Tailwind CSS v4; `cva` + `tailwix` for variants
- Convex — database, queries/mutations/actions, realtime subscriptions, file storage, scheduling
- better-auth via `@convex-dev/better-auth` (Google social login)
- TanStack Router — file-based routes in `src/routes`, generated `routeTree.gen.ts`
- zod v4 + `convex-helpers` for validation
- Deployed to Cloudflare Workers (wrangler)
- Path alias: `@/*` maps to `src/*`

## UI components — always reuse, never reinvent

Before building any UI, check if an existing component covers the need. Never create ad-hoc UI elements when a component already exists. Import from `@/ui/components/<name>`.

## Commands

- `bun dev` — vite dev server
- `bun dev:convex` — convex dev, codegen + backend watch; runs alongside `bun dev`
- `bun typecheck` — tsc
- `bun format-lint` — formatting & lint check
- `bun format-lint:fix` — formatting & lint fix

Verify every change with `bun typecheck` and `bun format-lint:fix`, nothing else. Never run `bun run build` or `bun deploy`. `bun dev` and `bun dev:convex` belong to the user — they must already be running for `routeTree.gen.ts` and `convex/_generated/` to regenerate, which new routes and new convex functions need before typecheck can pass.

## Code conventions

Apply to every code change, in any AI tool:

- No comments — names and types are the only documentation; rename/restructure until code needs no explaining. `biome-ignore` lines exempt.
- No `void` operator — call fire-and-forget promises bare.
- `const` arrow functions everywhere; `function` declarations only for React components and hooks.
- Named exports only, no `export default`. Exception: convex requires `export default` for `schema.ts`, `http.ts`, `convex.config.ts`.
- `if` + early returns over `switch`.
- Collapse a call followed by a bare `return` into `return fn(...)`, even when `fn` returns void.
- Inline single-use object types at params/props; extract a named `type` only when reused or too large to read inline. Exception: props that extend `React.ComponentProps<…>` stay as a named `interface X extends React.ComponentProps<…>` — inline `&` intersections with ComponentProps hurt TypeScript performance.
- Inline single-use JSX event handlers (`onClick`, `onChange`, …) regardless of length; extract only when reused.
- No `useCallback`/`useMemo` — the React 19 compiler memoizes.
- Self-source over prop-drilling: components get values via hooks (`useQuery`, `useParams`, context) — convex dedupes identical query+args across components. Props only for identity and callbacks.
- A hook with no state/effect/context/query is a pure function: `canManageWorkspace(member)`, not `useCanManageWorkspace(member)`.
- Queries: `useQuery` always from `convex-helpers/react/cache`, never `convex/react` — the plain one drops its subscription on unmount, so every revisit re-loads from scratch. `useMutation` still comes from `convex/react`.
- `useQuery(api.x.y, args)` returns `undefined` while loading — branch on `undefined`, there is no `isLoading`. Pass `"skip"` as args to hold a query back; never conditionally call the hook.
- Mutations: `const create = useMutation(api.project.create)`, called bare at the call site — no `await`, no `mutateAsync` equivalent. Prefer `.withOptimisticUpdate(…)` over pending state; the subscription reconciles. There is no `isPending` — `React.useState` at the call site when the UI genuinely needs it. Every call ends in `.catch(toastError)`; an uncaught rejection shows the user nothing.
- Forms: `onFormSubmit={(values) => …}` on `<Form>` — it calls `preventDefault()` itself and hands over typed values. Never `onSubmit` + `new FormData`.
- Name things for what they are: no `Mutation` suffix on mutation hooks; `*Dialog` not `*Modal`.
- Forms: don't disable submit while inputs are empty — `required` on `FieldControl` + sibling `<FieldError />`, validate on submit. `disabled` only for pending state and non-input gates.
- Conditional styling via `data-*` attributes + Tailwind `data-*:` variants (`data-active={x ? '' : undefined}`, `data-active:border-surface-8`), not ternaries or class-picking helpers.
- No IIFEs for derived values (`const x = (() => {...})()`). Loops over local accumulators in the component body are fine — render-local mutation is pure and often clearer than `reduce`. Needs early returns → extract a named function (module-level when reused). Fire-and-forget async IIFEs (`(async () => {...})();`) are acceptable.
- Least code wins. State changes go in the event handler that causes them, not `useEffect` + refs reconstructing intent. Effects only sync with things outside React (DOM, subscriptions, external stores). Growing effects/refs/readiness gates = stop, find the direct path.
- Composition over configuration. Never drive UI from config records — no `KEYS.map` over label/lookup tables, no hooks returning `{ value, label, icon }` render-data, no generic renderer components. Write each case out in JSX at its usage site, composing existing primitives, even when four blocks look similar — a component rendered once is indirection, inline it. Extract a component only when it's rendered from 2+ places or it's a reusable styled primitive taking children/callbacks; abstract shared behavior as pure helpers — never data-that-describes-JSX.

## Convex

- Query with `withIndex`, never `filter` — add the index to the table definition instead. Index name matches its fields (`.index("projectId", ["projectId"])`).
- Money as integer minor units (cents) — convex numbers are float64, never store decimals.
- Ids are `v.id("table")` in validators, `Id<"table">` in types — never bare `string`.
- `ctx.db` in queries/mutations only. Actions have no db access; they call `ctx.runQuery` / `ctx.runMutation`.
- Every function resolves the caller through the shared auth helpers (`getUser` / `safeGetUser`) and checks permissions server-side. Never trust identity or role passed in args.
- Helpers taking `ctx` are plain async functions in `utils.ts`, not exported convex functions.
- `query` / `mutation` always come from `@/functions`, never `@/convex/_generated/server` — those are the zod-validated builders and are the only ones features use.
- Args are zod schemas, `zid("table")` for ids. Put every constraint in the schema (`z.string().trim().min(1, "…")`, `z.number().int().positive("…")`) rather than hand-checking in the handler; only `ctx`-dependent checks (permissions, existence) belong there.
- Throw `ConvexError("message")`, never `Error` — plain `Error` messages are redacted to "Server Error" in production. `toastError` reads `.data` off it.

## Feature structure

Each `src/<feature>/` folder converges on one layout:
- `components/` — all components; none at the feature root, no `<subfeature>/` nesting.
- `functions.ts` — convex queries/mutations/actions.
- `schema.ts` — convex table definition + shared validators.
- `utils.ts` — pure helpers and `ctx` helpers. Server-reachable, so it must never import react.
- `hooks.ts` — react hooks wrapping `useQuery`/`useParams` for the feature. `constants.ts`, `types.ts` as needed.

Convex only loads modules under `src/convex/` (see `convex.json`), so each feature gets a one-line barrel — `src/convex/<feature>.ts` re-exporting `../<feature>/functions` — and that's what `api.<feature>.<fn>` resolves to. Register the feature's table in `src/convex/schema.ts`. Never write function bodies in `src/convex/`; it holds only barrels, `schema.ts`, `http.ts`, `auth.config.ts`, `convex.config.ts`, and `_generated/` (never edit `_generated/`).
